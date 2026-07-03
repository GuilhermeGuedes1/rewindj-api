import {
  ConflictException,
  Injectable,
  NotFoundException,
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

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(user: CurrentUserDto) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        userId: user.sub,
      },
    });

    if (!artist) {
      throw new NotFoundException('Artist profile not found');
    }

    return new ArtistResponseDto(artist);
  }

  async findAll(user: CurrentUserDto) {
    const artists = await this.prisma.artist.findMany({
      where: {
        organizationId: user.organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return artists.map((artist) => new ArtistResponseDto(artist));
  }

  async getEvents(user: CurrentUserDto) {
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
            email: true,
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

  async registerArtist(body: RegisterArtistDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const existingArtist = await this.prisma.artist.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingArtist) {
      throw new ConflictException('Artist already exists');
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
          name: body.name,
          email: body.email,
          password: passwordHashed,
          phone: body.phone,
          role: Role.ARTIST,
          organizationId: organization.id,
        },
      });

      const artistCreated = await tx.artist.create({
        data: {
          name: body.name,
          stageName: body.stageName || body.name,
          birthDate: body.birthDate ? new Date(body.birthDate) : null,
          phone: body.phone,
          email: body.email,
          address: body.address,
          city: body.city,
          state: body.state,
          pixKey: body.pixKey,
          userId: createdUser.id,
          organizationId: organization.id,
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
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        organizationId: result.user.organizationId,
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
      },
    });

    return {
      message: 'Artist profile updated successfully',
      artist: new ArtistResponseDto(updatedArtist),
    };
  }
}
