import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserDto } from 'src/auth/dtos/user.dto';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async getArtists(user: CurrentUserDto) {
    const artists = await this.prisma.user.findMany({
      where: { organizationId: user.organizationId, role: 'ARTIST' },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return artists;
  }
}
