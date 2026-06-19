import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsBoolean, IsEnum } from 'class-validator';
import { PaymentMethod } from '../../generated/prisma/client';

export enum EventStatusDto {
  NEGOTIATING = 'NEGOTIATING',
  CONFIRMED = 'CONFIRMED',
  LOST = 'LOST',
}

export class CreateEventDto {
  @ApiProperty({
    example: 'Wedding at Copacabana Palace',
    description:
      'Internal event title used to identify the booking inside the organization.',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: '2026-12-20',
    description: 'Event date in ISO date format (YYYY-MM-DD).',
  })
  @IsDateString()
  eventDate!: string;

  @ApiProperty({
    example: '18:00',
    description: 'Scheduled start time in 24-hour HH:mm format.',
  })
  @IsString()
  @IsNotEmpty()
  startTime!: string;

  @ApiProperty({
    example: '23:00',
    description: 'Scheduled end time in 24-hour HH:mm format.',
  })
  @IsString()
  @IsNotEmpty()
  endTime!: string;

  @ApiProperty({
    example: 'Copacabana Palace',
    description: 'Venue or place where the event will happen.',
  })
  @IsString()
  @IsNotEmpty()
  venueName!: string;

  @ApiProperty({
    example: 'Av. Atlântica, 1702',
    description: 'Street address for the event venue.',
  })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({
    example: 'Rio de Janeiro',
    description: 'City where the event will happen.',
  })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({
    example: 'RJ',
    description: 'State or region abbreviation for the event location.',
  })
  @IsString()
  @IsNotEmpty()
  state!: string;

  @ApiPropertyOptional({
    example: 'Client requested open format set until midnight',
    description: 'Operational notes, rider details, or client preferences.',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    example: 'c4c49f6c-0b0c-4e7f-a92f-1c8d7c6b9d8e',
    description: 'Identifier of the artist assigned to perform at the event.',
  })
  @IsUUID()
  artistId!: string;

  @ApiProperty({
    example: 'Maria Silva',
    description:
      'Client name. A client record is created together with the event.',
  })
  @IsString()
  @IsNotEmpty()
  clientName!: string;

  @ApiPropertyOptional({
    example: '+5521999999999',
    description: 'Client phone number for event coordination.',
  })
  @IsString()
  @IsOptional()
  clientPhone?: string;

  @ApiPropertyOptional({
    example: 'maria@email.com',
    description: 'Client email address for event coordination.',
  })
  @IsEmail()
  @IsOptional()
  clientEmail?: string;

  @ApiPropertyOptional({
    example: '6h',
    description: 'Expected artist performance duration.',
  })
  @IsString()
  @IsOptional()
  setDuration?: string;

  @ApiPropertyOptional({
    example: '2026-12-10',
    description:
      'Expected or agreed payment date in ISO date format (YYYY-MM-DD).',
  })
  @IsDateString()
  @IsOptional()
  paymentDate?: string;

  @ApiPropertyOptional({
    enum: PaymentMethod,
    enumName: 'PaymentMethod',
    example: PaymentMethod.PIX,
    description: 'Commercial payment arrangement agreed for the event.',
  })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the event already has a signed contract.',
  })
  @IsBoolean()
  @IsOptional()
  hasContract?: boolean;

  @ApiPropertyOptional({
    enum: EventStatusDto,
    enumName: 'EventStatus',
    example: EventStatusDto.NEGOTIATING,
    description: 'Current negotiation status of the event.',
  })
  @IsEnum(EventStatusDto)
  @IsOptional()
  status?: EventStatusDto;

  @ApiPropertyOptional({
    example: 'Empresa XYZ',
    description: 'Company or brand represented by the client, when applicable.',
  })
  @IsString()
  @IsOptional()
  clientCompanyName?: string;
}
