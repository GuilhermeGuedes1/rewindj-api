import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { CurrentUserDto } from 'src/auth/dtos/user.dto';
import { EventResponseDto } from './event-response.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(data: CreateEventDto, user: CurrentUserDto) {
    const client = await this.prisma.client.create({
      data: {
        name: data.clientName,
        phone: data.clientPhone,
        email: data.clientEmail,
        organizationId: user.organizationId,
      },
    });

    const eventCreated = await this.prisma.event.create({
      data: {
        title: data.title,
        eventDate: data.eventDate,
        startTime: data.startTime,
        endTime: data.endTime,
        venueName: data.venueName,
        address: data.address,
        city: data.city,
        state: data.state,
        fee: data.fee,
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
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return {
      message: 'Event created successfully',
      event: new EventResponseDto(eventCreated),
    };
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
            lastName: true,
            email: true,
            role: true,
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
