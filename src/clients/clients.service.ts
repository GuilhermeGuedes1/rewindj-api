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

  async getClients(user: CurrentUserDto) {
    this.ensureCanManageClients(user);

    const clients = await this.prisma.client.findMany({
      where: {
        organizationId: user.organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return clients.map((client) => new ClientResponseDto(client));
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
