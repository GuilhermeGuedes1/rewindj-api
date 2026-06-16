import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { CurrentUserDto } from 'src/auth/dtos/user.dto';
import { EventResponseDto } from './event-response.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(data: CreateEventDto, user: CurrentUserDto) {
    try {
      const client = await this.prisma.client.create({
        data: {
          name: data.clientName,
          phone: data.clientPhone,
          email: data.clientEmail,
          companyName: data.clientCompanyName,
          organizationId: user.organizationId,
        },
      });

      const eventCreated = await this.prisma.event.create({
        data: {
          title: data.title,
          eventDate: new Date(`${data.eventDate}T00:00:00.000Z`),
          paymentDate: data.paymentDate
            ? new Date(`${data.paymentDate}T00:00:00.000Z`)
            : undefined,
          startTime: data.startTime,
          endTime: data.endTime,
          setDuration: data.setDuration,
          venueName: data.venueName,
          address: data.address,
          city: data.city,
          state: data.state,
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
              fullName: true,
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
            fullName: true,
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
}
