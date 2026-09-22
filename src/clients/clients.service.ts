import { PrismaService } from 'src/prisma/prisma.service';
import { createClientDto } from './dtos/create-client.dto';
import { CurrentUserDto } from 'src/auth/dtos/user.dto';
import { ClientDetailsResponseDto } from './dtos/client-detail-response.dto';
import { ClientResponseDto } from './dtos/client-response.dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Role } from 'src/generated/prisma/client';
import { PaginationDTO } from 'src/events/dtos/pagination-dto';
import { buildEventAuthorizationWhere } from 'src/auth/event-authorization';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}
  private ensureCanManageClients(user: CurrentUserDto) {
    if (user.role === Role.ARTIST && !user.isIndependent) {
      throw new ForbiddenException('Agency artists cannot manage clients');
    }
  }

  createClient(data: createClientDto) {
    return { message: data };
  }

  async getClients(user: CurrentUserDto, pagination: PaginationDTO) {
    this.ensureCanManageClients(user);

    const { page = 1 } = pagination;
    const limit = 10;
    const skip = (page - 1) * limit;

    const where =
      user.role === Role.ARTIST && user.isIndependent
        ? {
            artistId: user.artistId,
          }
        : {
            organizationId: user.organizationId,
          };

    const count = await this.prisma.client.count({
      where,
    });

    if (skip >= count && count > 0) {
      throw new BadRequestException('Page number exceeds total pages');
    }

    const pageTotal = Math.ceil(count / limit);

    const clients = await this.prisma.client.findMany({
      skip,
      take: limit,
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      meta: {
        total: count,
        page,
        pageTotal,
      },
      data: clients.map((client) => new ClientResponseDto(client)),
    };
  }

  async getClientById(id: string, user: CurrentUserDto) {
    this.ensureCanManageClients(user);

    const where =
      user.role === Role.ARTIST && user.isIndependent
        ? {
            id,
            artistId: user.artistId,
          }
        : {
            id,
            organizationId: user.organizationId!,
          };

    const client = await this.prisma.client.findFirst({
      where,
      include: {
        events: {
          where: buildEventAuthorizationWhere(user),
          include: {
            artist: {
              select: {
                name: true,
                stageName: true,
              },
            },
          },
          orderBy: {
            eventDate: 'desc',
          },
        },
      },
    });

    if (!client) {
      throw new BadRequestException('Client does not exist');
    }

    return new ClientDetailsResponseDto(client);
  }
}
