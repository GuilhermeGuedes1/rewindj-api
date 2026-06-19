import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventStatus } from '../generated/prisma/client';

class EventClientResponseDto {
  @ApiProperty({
    example: '6c946351-37b4-4519-9117-34b84d49c3dc',
    description: 'Client identifier.',
  })
  id!: string;

  @ApiProperty({
    example: 'Maria Silva',
    description: 'Client name.',
  })
  name!: string;

  @ApiPropertyOptional({
    example: '+5521999999999',
    nullable: true,
    description: 'Client phone number.',
  })
  phone!: string | null;

  @ApiPropertyOptional({
    example: 'maria@email.com',
    nullable: true,
    description: 'Client email address.',
  })
  email!: string | null;
}

class EventArtistResponseDto {
  @ApiProperty({
    example: 'c4c49f6c-0b0c-4e7f-a92f-1c8d7c6b9d8e',
    description: 'Artist identifier.',
  })
  id!: string;

  @ApiProperty({
    example: 'Joao Pereira',
    description: 'Artist full legal or registration name.',
  })
  name!: string;

  @ApiProperty({
    example: 'DJ Orbit',
    description: 'Artist public stage name.',
  })
  stageName!: string;

  @ApiPropertyOptional({
    example: 'dj.orbit@email.com',
    nullable: true,
    description: 'Artist contact email.',
  })
  email!: string | null;
}

export class EventResponseDto {
  @ApiProperty({
    example: '2ad82f5d-8298-40d2-8e99-05832c16b8c0',
    description: 'Event identifier.',
  })
  id: string;

  @ApiProperty({
    example: 'Wedding at Copacabana Palace',
    description: 'Event title.',
  })
  title: string;

  @ApiProperty({
    example: '2026-12-20T00:00:00.000Z',
    description: 'Event date as stored by the API.',
  })
  eventDate: Date;

  @ApiPropertyOptional({
    example: '18:00',
    nullable: true,
    description: 'Scheduled start time.',
  })
  startTime: string;

  @ApiPropertyOptional({
    example: '23:00',
    nullable: true,
    description: 'Scheduled end time.',
  })
  endTime: string;

  @ApiPropertyOptional({
    example: 'Copacabana Palace',
    nullable: true,
    description: 'Venue name.',
  })
  venueName: string;

  @ApiPropertyOptional({
    example: 'Av. Atlantica, 1702',
    nullable: true,
    description: 'Venue street address.',
  })
  address: string;

  @ApiPropertyOptional({
    example: 'Rio de Janeiro',
    nullable: true,
    description: 'Venue city.',
  })
  city: string;

  @ApiPropertyOptional({
    example: 'RJ',
    nullable: true,
    description: 'Venue state or region.',
  })
  state: string;

  @ApiProperty({
    enum: EventStatus,
    enumName: 'EventStatus',
    example: EventStatus.NEGOTIATING,
    description: 'Current commercial status of the event.',
  })
  status: EventStatus;

  @ApiPropertyOptional({
    example: 3500,
    description: 'Commercial event fee when available.',
  })
  fee: number;

  @ApiPropertyOptional({
    example: 'Client requested open format set until midnight',
    nullable: true,
    description: 'Operational notes for the event.',
  })
  notes: string | null;

  @ApiProperty({
    type: EventClientResponseDto,
    description: 'Client linked to the event.',
  })
  client: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };

  @ApiProperty({
    type: EventArtistResponseDto,
    description: 'Artist assigned to the event.',
  })
  artist: {
    id: string;
    name: string;
    stageName: string;
    email: string;
  };

  constructor(event: any) {
    this.id = event.id;
    this.title = event.title;
    this.eventDate = event.eventDate;
    this.startTime = event.startTime;
    this.endTime = event.endTime;
    this.venueName = event.venueName;
    this.address = event.address;
    this.city = event.city;
    this.state = event.state;
    this.status = event.status;
    this.fee = event.fee;
    this.notes = event.notes;

    this.client = {
      id: event.client.id,
      name: event.client.name,
      phone: event.client.phone,
      email: event.client.email,
    };

    this.artist = {
      id: event.artist.id,
      name: event.artist.name,
      stageName: event.artist.stageName,
      email: event.artist.email,
    };
  }
}

export class CreateEventResponseDto {
  @ApiProperty({
    example: 'Event created successfully',
    description: 'Human-readable event creation status message.',
  })
  message!: string;

  @ApiProperty({
    type: EventResponseDto,
    description: 'Event created with linked client and artist data.',
  })
  event!: EventResponseDto;
}
