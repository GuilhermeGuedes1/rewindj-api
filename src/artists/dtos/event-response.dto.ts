import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../../generated/prisma/client';

type EventWithRelations = {
  id: string;
  title: string;
  eventDate: Date;
  startTime: string | null;
  endTime: string | null;
  setDuration: string | null;
  venueName: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  paymentDate: Date | null;
  paymentMethod: PaymentMethod | null;
  hasContract: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  client: {
    id: string;
    name: string;
    companyName: string | null;
    phone: string | null;
    email: string | null;
  } | null;
  artist: {
    id: string;
    name: string;
    stageName: string;
    email: string | null;
    phone: string | null;
  } | null;
};

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
  startTime: string | null;

  @ApiPropertyOptional({
    example: '23:00',
    nullable: true,
    description: 'Scheduled end time.',
  })
  endTime: string | null;

  @ApiPropertyOptional({
    example: '6h',
    nullable: true,
    description: 'Expected artist performance duration.',
  })
  setDuration: string | null;

  @ApiPropertyOptional({
    example: 'Copacabana Palace',
    nullable: true,
    description: 'Venue name.',
  })
  venueName: string | null;

  @ApiPropertyOptional({
    example: 'Av. Atlantica, 1702',
    nullable: true,
    description: 'Venue street address.',
  })
  address: string | null;

  @ApiPropertyOptional({
    example: 'Rio de Janeiro',
    nullable: true,
    description: 'Venue city.',
  })
  city: string | null;

  @ApiPropertyOptional({
    example: 'RJ',
    nullable: true,
    description: 'Venue state or region.',
  })
  state: string | null;

  @ApiPropertyOptional({
    example: '2026-12-10T00:00:00.000Z',
    nullable: true,
    description: 'Expected or agreed payment date.',
  })
  paymentDate: Date | null;

  @ApiPropertyOptional({
    enum: PaymentMethod,
    enumName: 'PaymentMethod',
    example: PaymentMethod.PIX,
    nullable: true,
    description: 'Commercial payment arrangement agreed for the event.',
  })
  paymentMethod: PaymentMethod | null;

  @ApiProperty({
    example: true,
    description: 'Whether the event already has a signed contract.',
  })
  hasContract: boolean;

  @ApiPropertyOptional({
    example: 'Client requested open format set until midnight',
    nullable: true,
    description: 'Operational notes for the event.',
  })
  notes: string | null;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Client linked to the event.',
  })
  client: EventWithRelations['client'];

  @ApiPropertyOptional({
    nullable: true,
    description: 'Artist assigned to the event.',
  })
  artist: EventWithRelations['artist'];

  @ApiProperty({
    example: '2026-06-16T12:00:00.000Z',
    description: 'Event creation timestamp.',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-06-16T12:00:00.000Z',
    description: 'Event last update timestamp.',
  })
  updatedAt: Date;

  constructor(event: EventWithRelations) {
    this.id = event.id;
    this.title = event.title;
    this.eventDate = event.eventDate;
    this.startTime = event.startTime;
    this.endTime = event.endTime;
    this.setDuration = event.setDuration;
    this.venueName = event.venueName;
    this.address = event.address;
    this.city = event.city;
    this.state = event.state;
    this.paymentDate = event.paymentDate;
    this.paymentMethod = event.paymentMethod;
    this.hasContract = event.hasContract;
    this.notes = event.notes;
    this.client = event.client;
    this.artist = event.artist;
    this.createdAt = event.createdAt;
    this.updatedAt = event.updatedAt;
  }
}
