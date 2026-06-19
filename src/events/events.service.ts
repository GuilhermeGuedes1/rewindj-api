import {
  ConflictException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { CurrentUserDto } from 'src/auth/dtos/user.dto';
import { EventResponseDto } from './event-response.dto';
import { EventDetailsResponseDto } from './dtos/event-detail-response.dto';
import { EventStatus } from '../generated/prisma/client';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  private parseRequiredDateOnly(value: string) {
    const date = new Date(`${value}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`Invalid date format: ${value}`);
    }

    return date;
  }

  private parseOptionalDateOnly(value?: string | null) {
    if (!value) return undefined;

    const date = new Date(`${value}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`Invalid date format: ${value}`);
    }

    return date;
  }

  async createEvent(data: CreateEventDto, user: CurrentUserDto) {
    try {
      const clientWhereOr: Prisma.ClientWhereInput[] = [];

      if (data.clientEmail) {
        clientWhereOr.push({ email: data.clientEmail });
      }

      if (data.clientPhone) {
        clientWhereOr.push({ phone: data.clientPhone });
      }

      let client = clientWhereOr.length
        ? await this.prisma.client.findFirst({
            where: {
              organizationId: user.organizationId,
              OR: clientWhereOr,
            },
          })
        : null;

      if (!client) {
        client = await this.prisma.client.create({
          data: {
            name: data.clientName,
            phone: data.clientPhone,
            email: data.clientEmail,
            companyName: data.clientCompanyName,
            organizationId: user.organizationId,
          },
        });
      }

      const eventCreated = await this.prisma.event.create({
        data: {
          title: data.title,
          eventDate: this.parseRequiredDateOnly(data.eventDate),
          paymentDate: this.parseOptionalDateOnly(data.paymentDate),
          startTime: data.startTime,
          endTime: data.endTime,
          setDuration: data.setDuration,
          venueName: data.venueName,
          address: data.address,
          city: data.city,
          state: data.state,
          status: data.status ?? EventStatus.NEGOTIATING,
          paymentMethod: data.paymentMethod,
          hasContract: data.hasContract,
          notes: data.notes,
          artistId: data.artistId,
          clientId: client.id,
          organizationId: user.organizationId,
        },
        include: {
          client: true,
          artist: {
            select: {
              id: true,
              name: true,
              stageName: true,
              email: true,
            },
          },
        },
      });

      return {
        message: 'Event created successfully',
        event: new EventResponseDto(eventCreated),
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'An event with the same title, artist and date already exists.',
        );
      }

      throw error;
    }
  }

  async getEvents(user: CurrentUserDto) {
    const events = await this.prisma.event.findMany({
      where: {
        organizationId: user.organizationId,
      },
      include: {
        client: true,
        artist: {
          select: {
            id: true,
            name: true,
            stageName: true,
            email: true,
          },
        },
      },
      orderBy: {
        eventDate: 'asc',
      },
    });

    return events.map((event) => new EventResponseDto(event));
  }

  async getEventById(id: string, user: CurrentUserDto) {
    const event = await this.prisma.event.findFirst({
      where: {
        id,
        organizationId: user.organizationId,
      },
      include: {
        client: true,
        artist: {
          select: {
            id: true,
            name: true,
            stageName: true,
            email: true,
          },
        },
      },
    });

    if (!event) {
      throw new BadRequestException("Event doesn't exist");
    }

    return new EventDetailsResponseDto(event);
  }
}
