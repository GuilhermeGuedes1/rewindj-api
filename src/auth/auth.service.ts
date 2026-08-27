import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from './dtos/users-response.dto';
import { CurrentUserDto } from './dtos/user.dto';
import { MeResponseDto } from './dtos/me-response.dto';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private storageService: StorageService,
  ) {}

  async register(data: RegisterDto) {
    const userAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userAlreadyExists) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: passwordHash,
        },
      });

      const artist = await tx.artist.create({
        data: {
          userId: user.id,
          name: null,
          stageName: null,
          phone: null,
          profileImageKey: null,
          role: Role.ARTIST,
          isIndependent: true,
          organizationId: null,
        },
      });

      return {
        user,
        artist,
      };
    });

    const payload = this.buildJwtPayload({
      user: result.user,
      artist: result.artist,
    });

    return {
      access_token: await this.jwt.signAsync(payload),
      isNewUser: true,
      user: new UserResponseDto(result.user),
    };
  }

  async googleLogin(googleUser: {
    email?: string;
    googleId: string;
    name?: string;
    lastName?: string;
    avatarUrl?: string;
  }) {
    if (!googleUser.email) {
      throw new UnauthorizedException('Google account has no email.');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: googleUser.email,
      },
      include: {
        artist: true,
      },
    });

    if (existingUser?.artist) {
      const payload = this.buildJwtPayload({
        user: existingUser,
        artist: existingUser.artist,
      });

      return {
        accessToken: await this.jwt.signAsync(payload),
        isNewUser: false,
      };
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const user =
        existingUser ??
        (await tx.user.create({
          data: {
            email: googleUser.email!,
            password: null,
          },
        }));

      const artist = await tx.artist.create({
        data: {
          userId: user.id,
          name: googleUser.name || null,
          stageName: null,
          phone: null,
          profileImageKey: null,
          role: Role.ARTIST,
          isIndependent: true,
          organizationId: null,
        },
      });

      return {
        user,
        artist,
      };
    });

    const payload = this.buildJwtPayload({
      user: result.user,
      artist: result.artist,
    });

    return {
      accessToken: await this.jwt.signAsync(payload),
      isNewUser: true,
    };
  }

  async login(data: LoginDto): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            role: true,
            organizationId: true,
            isIndependent: true,
          },
        },
      },
    });

    if (!user || !user.artist || !user.password) {
      throw new UnauthorizedException('User or email invalids');
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('User or email invalids');
    }

    const payload = this.buildJwtPayload({
      user,
      artist: user.artist,
    });

    return {
      access_token: await this.jwt.signAsync(payload),
    };
  }

  async getMe(currentUser: CurrentUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: currentUser.sub,
      },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            phone: true,
            profileImageKey: true,
            role: true,
            organizationId: true,
            isIndependent: true,
            organization: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.artist) {
      throw new UnauthorizedException('User not found');
    }

    const profileImageUrl = await this.storageService.getFile(
      process.env.AWS_BUCKET_NAME!,
      user.artist.profileImageKey ?? null,
    );

    return new MeResponseDto({
      id: user.id,
      name: user.artist.name ?? undefined,
      email: user.email,
      phone: user.artist.phone || undefined,
      role: user.artist.role,
      profileImage: profileImageUrl,
      organizationId: user.artist.organizationId ?? undefined,
      organizationName: user.artist.organization?.name,
      artistId: user.artist.id,
      isIndependent: user.artist.isIndependent
    
    });
  }

  async getUsers(user: CurrentUserDto) {
    if (!user.organizationId) {
      throw new UnauthorizedException('User has no organization');
    }

    const artists = await this.prisma.artist.findMany({
      where: {
        organizationId: user.organizationId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return artists.map((artist) => ({
      id: artist.user?.id,
      email: artist.user?.email,
      name: artist.name,
      phone: artist.phone,
      role: artist.role,
      organizationId: artist.organizationId,
      artistId: artist.id,
      isIndependent: artist.isIndependent,
    }));
  }

  private buildJwtPayload({
    user,
    artist,
  }: {
    user: {
      id: string;
      email: string;
    };
    artist: {
      id: string;
      name: string | null;
      role: Role;
      organizationId: string | null;
      isIndependent: boolean;
    };
  }) {
    return {
      sub: user.id,
      email: user.email,
      artistId: artist.id,
      name: artist.name,
      role: artist.role,
      organizationId: artist.organizationId,
      isIndependent: artist.isIndependent,
    };
  }
}
