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
import { AccountType, Role } from 'src/generated/prisma/client';
import { PaginationDTO } from 'src/events/dtos/pagination-dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}
  private ensureCanManageClients(user: CurrentUserDto) {
    if (user.role === Role.ARTIST && user.accountType === AccountType.AGENCY) {
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

    const count = await this.prisma.client.count({
      where: {
        organizationId: user.organizationId,
      },
    });

    if (skip >= count) {
      throw new BadRequestException('Page number exceeds total pages');
    }

    const pageTotal = Math.ceil(count / limit);

    const clients = await this.prisma.client.findMany({
      skip,
      take: limit,
      where: {
        organizationId: user.organizationId,
      },
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

    const client = await this.prisma.client.findFirst({
      where: {
        id,
        organizationId: user.organizationId,
      },
      include: {
        events: {
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
