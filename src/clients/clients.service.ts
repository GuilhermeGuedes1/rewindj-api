import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createClientDto } from './dtos/create-client.dto';
import { CurrentUserDto } from 'src/auth/dtos/user.dto';
import { ClientResponseDto } from './dtos/client-response.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  createClient(data: createClientDto) {
    return { message: data };
  }

  async getClients(user: CurrentUserDto) {
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
    const client = await this.prisma.client.findFirst({
      where: {
        id,
        organizationId: user.organizationId,
      },
    });

    if (!client) {
      throw new BadRequestException('Client does not exist');
    }

    return new ClientResponseDto(client);
  }
}
