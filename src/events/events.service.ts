import {
  ConflictException,
  Injectable,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { CurrentUserDto } from 'src/auth/dtos/user.dto';
import { EventResponseDto } from './event-response.dto';
import { EventDetailsResponseDto } from './dtos/event-detail-response.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { AccountType, EventStatus, Role } from '../generated/prisma/client';
import { PaginationDTO } from './dtos/pagination-dto';

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
    if (user.role === Role.ARTIST && user.accountType === AccountType.AGENCY) {
      throw new ForbiddenException('Agency artists cannot create events');
    }

    const eventArtistId =
      user.role === Role.ARTIST &&
      user.accountType === AccountType.INDEPENDENT_ARTIST
        ? user.artistId
        : data.artistId;

    if (!eventArtistId) {
      throw new BadRequestException('Artist is required');
    }

    const artist = await this.prisma.artist.findFirst({
      where: {
        id: eventArtistId,
        organizationId: user.organizationId,
      },
    });

    if (!artist) {
      throw new BadRequestException("Artist doesn't exist");
    }

    try {
      let client;

      if (data.clientId) {
        client = await this.prisma.client.findFirst({
          where: {
            id: data.clientId,
            organizationId: user.organizationId,
          },
        });

        if (!client) {
          throw new BadRequestException("Client doesn't exist");
        }
      } else {
        if (!data.clientName) {
          throw new BadRequestException('Client name is required');
        }

        const clientWhereOr: Prisma.ClientWhereInput[] = [];

        if (data.clientEmail) {
          clientWhereOr.push({ email: data.clientEmail });
        }

        if (data.clientPhone) {
          clientWhereOr.push({ phone: data.clientPhone });
        }

        client = clientWhereOr.length
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
          fee: data.fee,
          paymentMethod: data.paymentMethod,
          hasContract: data.hasContract,
          notes: data.notes,
          artistId: eventArtistId,
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

  async getEvents(user: CurrentUserDto, pagination: PaginationDTO) {
    const where: Prisma.EventWhereInput = {
      organizationId: user.organizationId,
    };

    if (user.role === Role.ARTIST && user.accountType === AccountType.AGENCY) {
      where.artistId = user.artistId;
    }

    const { page = 1 } = pagination;
    const limit = 10;
    const skip = (page - 1) * limit;

    const count = await this.prisma.event.count({ where });

    const pageTotal = Math.ceil(count / limit);

    const events = await this.prisma.event.findMany({
      where,
      skip,
      take: limit,
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

    return {
      meta: {
        page,
        limit,
        count,
        pageTotal,
      },
      data: events.map((event) => new EventResponseDto(event)),
    };
  }

  async getEventById(id: string, user: CurrentUserDto) {
    const where: Prisma.EventWhereInput = {
      id,
      organizationId: user.organizationId,
    };

    if (user.role === Role.ARTIST && user.accountType === AccountType.AGENCY) {
      where.artistId = user.artistId;
    }

    const event = await this.prisma.event.findFirst({
      where,
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

  async updateEvent(id: string, data: UpdateEventDto, user: CurrentUserDto) {
    if (!user) {
      throw new UnauthorizedException('Authenticated user not found');
    }

    if (user.role === Role.ARTIST && user.accountType === AccountType.AGENCY) {
      throw new ForbiddenException('Agency artists cannot update events');
    }

    const event = await this.prisma.event.findFirst({
      where: {
        id,
        organizationId: user.organizationId,
      },
    });

    if (!event) {
      throw new BadRequestException("Event doesn't exist");
    }
    const {
      artistId,
      clientId,
      clientName,
      clientPhone,
      clientEmail,
      clientCompanyName,
      ...eventData
    } = data;

    void clientId;

    if (event.clientId) {
      await this.prisma.client.update({
        where: {
          id: event.clientId,
        },
        data: {
          name: clientName,
          phone: clientPhone,
          email: clientEmail,
          companyName: clientCompanyName,
        },
      });
    }

    const updatedEvent = await this.prisma.event.update({
      where: {
        id,
      },
      data: {
        ...eventData,

        eventDate: data.eventDate
          ? this.parseRequiredDateOnly(data.eventDate)
          : undefined,

        paymentDate: data.paymentDate
          ? this.parseOptionalDateOnly(data.paymentDate)
          : undefined,

        artist: artistId
          ? {
              connect: {
                id: artistId,
              },
            }
          : undefined,
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
      message: 'Event updated successfully',
      event: new EventResponseDto(updatedEvent),
    };
  }
}
