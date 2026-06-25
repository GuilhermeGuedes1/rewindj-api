import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserDto } from '../auth/dtos/user.dto';
import { ArtistResponseDto } from './dtos/artist-response.dto';
import { EventResponseDto } from './dtos/event-response.dto';
import { UpdateArtistDto } from './dtos/update-artist-dto';

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
}
