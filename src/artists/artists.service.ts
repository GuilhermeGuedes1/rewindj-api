import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserDto } from '../auth/dtos/user.dto';
import { ArtistResponseDto } from './dtos/artist-response.dto';
import { EventResponseDto } from './dtos/event-response.dto';
import { UpdateArtistDto } from './dtos/update-artist-dto';
import { RegisterArtistDto } from './dtos/register-artist.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/generated/prisma/enums';
import { randomUUID } from 'crypto';
import { ensureCanManageOrganization } from 'src/auth/organization-authorization';
import { StorageService } from 'src/storage/storage.service';
import sharp from 'sharp';

@Injectable()
export class ArtistsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async getMe(user: CurrentUserDto) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        userId: user.sub,
      },
    });

    if (!artist) {
      throw new NotFoundException('Artist profile not found');
    }

    const profileImageUrl = await this.storageService.getFile(
      process.env.AWS_BUCKET_NAME!,
      artist.profileImageKey,
    );

    return {
      ...new ArtistResponseDto(artist),
      profileImageUrl,
    };
  }

  async findAll(user: CurrentUserDto) {
    ensureCanManageOrganization(user);

    const artists = await this.prisma.artist.findMany({
      where: {
        organizationId: user.organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Promise.all(
      artists.map(async (artist) => {
        const profileImageUrl = await this.storageService.getFile(
          process.env.AWS_BUCKET_NAME!,
          artist.profileImageKey,
        );

        return {
          ...new ArtistResponseDto(artist),
          profileImageUrl,
        };
      }),
    );
  }

  async getEvents(user: CurrentUserDto) {
    if (!user.organizationId) {
      throw new UnauthorizedException('User has no organization');
    }
    const artist = await this.prisma.artist.findUnique({
      where: {
        userId: user.sub,
      },
    });

    if (!artist) {
      throw new NotFoundException('Artist profile not found');
    }

    const events = await this.prisma.event.findMany({
      where: {
        artistId: artist.id,
        organizationId: user.organizationId,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            companyName: true,
            phone: true,
            email: true,
          },
        },
        artist: {
          select: {
            id: true,
            name: true,
            stageName: true,
            phone: true,
          },
        },
      },
      orderBy: {
        eventDate: 'asc',
      },
    });

    return events.map((event) => new EventResponseDto(event));
  }

  async getArtistById(id: string, user: CurrentUserDto) {
    ensureCanManageOrganization(user);

    const artist = await this.prisma.artist.findFirst({
      where: {
        organizationId: user.organizationId,
        id,
      },
    });

    if (!artist) {
      throw new NotFoundException('Artist profile not found');
    }

    return new ArtistResponseDto(artist);
  }

  async updateArtist(id: string, data: UpdateArtistDto, user: CurrentUserDto) {
    ensureCanManageOrganization(user);

    const artist = await this.prisma.artist.findFirst({
      where: {
        organizationId: user.organizationId,
        id,
      },
    });

    if (!artist) {
      throw new NotFoundException('Artist profile not found');
    }

    const updatedArtist = await this.prisma.artist.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        stageName: data.stageName,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        pixKey: data.pixKey,
      },
    });

    return {
      message: 'Artist is succefully updated',
      artist: new ArtistResponseDto(updatedArtist),
    };
  }

  async updateProfileImage(file: Express.Multer.File, user: CurrentUserDto) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        userId: user.sub,
      },
    });

    if (!artist) {
      throw new NotFoundException('Artist profile not found');
    }

    let imageBuffer: Buffer;

    try {
      imageBuffer = await sharp(file.buffer)
        .rotate()
        .jpeg({
          quality: 85,
        })
        .toBuffer();
    } catch {
      throw new BadRequestException('Invalid image file');
    }

    const key = await this.storageService.uploadFile(
      process.env.AWS_BUCKET_NAME!,
      imageBuffer,
      'image/jpeg',
    );

    const updatedArtist = await this.prisma.artist.update({
      where: {
        id: artist.id,
      },
      data: {
        profileImageKey: key,
      },
    });

    return {
      message: 'Profile image updated successfully',
      artist: new ArtistResponseDto(updatedArtist),
    };
  }

  async registerArtist(body: RegisterArtistDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const passwordHashed = await bcrypt.hash(body.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: body.stageName || body.name,
          email: body.email,
          document: `independent-dj-${randomUUID()}`,
          accountType: 'INDEPENDENT_ARTIST',
        },
      });

      const createdUser = await tx.user.create({
        data: {
          email: body.email,
          password: passwordHashed,
        },
      });

      const artistCreated = await tx.artist.create({
        data: {
          name: body.name,
          stageName: body.stageName || body.name,
          birthDate: body.birthDate ? new Date(body.birthDate) : null,
          phone: body.phone,
          address: body.address,
          city: body.city,
          state: body.state,
          pixKey: body.pixKey,
          role: Role.ARTIST,
          isIndependent: true,
          userId: createdUser.id,
          organizationId: null,
        },
      });

      return {
        user: createdUser,
        artist: artistCreated,
        organization,
      };
    });

    return {
      message: 'Account created successfully',
      user: {
        id: result.user.id,
        email: result.user.email,
      },
      artist: new ArtistResponseDto(result.artist),
    };
  }

  async updateMe(data: UpdateArtistDto, user: CurrentUserDto) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        userId: user.sub,
      },
    });

    if (!artist) {
      throw new NotFoundException('Artist profile not found');
    }

    const updatedArtist = await this.prisma.artist.update({
      where: {
        id: artist.id,
      },
      data: {
        name: data.name,
        stageName: data.stageName,
        phone: data.phone,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        address: data.address,
        city: data.city,
        state: data.state,
        pixKey: data.pixKey,
        profileImageKey: data.profileImageKey,
      },
    });

    return {
      message: 'Artist profile updated successfully',
      artist: new ArtistResponseDto(updatedArtist),
    };
  }
}
