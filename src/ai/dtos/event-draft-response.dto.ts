import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../../generated/prisma/client';

export class EventDraftResponseDto {
  @ApiPropertyOptional({
    example: 'Wedding at Copacabana Palace',
    nullable: true,
    description: 'Suggested event title extracted from the prompt.',
  })
  title!: string | null;

  @ApiPropertyOptional({
    example: '2026-12-20',
    nullable: true,
    description: 'Suggested event date in YYYY-MM-DD format.',
  })
  eventDate!: string | null;

  @ApiPropertyOptional({
    example: '18:00',
    nullable: true,
    description: 'Suggested start time.',
  })
  startTime!: string | null;

  @ApiPropertyOptional({
    example: '23:00',
    nullable: true,
    description: 'Suggested end time.',
  })
  endTime!: string | null;

  @ApiPropertyOptional({
    example: '6h',
    nullable: true,
    description: 'Suggested performance duration.',
  })
  setDuration!: string | null;

  @ApiPropertyOptional({
    example: 'Copacabana Palace',
    nullable: true,
    description: 'Suggested venue name.',
  })
  venueName!: string | null;

  @ApiPropertyOptional({
    example: 'Av. Atlantica, 1702',
    nullable: true,
    description: 'Suggested venue address.',
  })
  address!: string | null;

  @ApiPropertyOptional({
    example: 'Rio de Janeiro',
    nullable: true,
    description: 'Suggested city.',
  })
  city!: string | null;

  @ApiPropertyOptional({
    example: 'RJ',
    nullable: true,
    description: 'Suggested state or region.',
  })
  state!: string | null;

  @ApiPropertyOptional({
    example: '2026-12-10',
    nullable: true,
    description: 'Suggested payment date in YYYY-MM-DD format.',
  })
  paymentDate!: string | null;

  @ApiPropertyOptional({
    enum: PaymentMethod,
    enumName: 'PaymentMethod',
    example: PaymentMethod.PIX,
    nullable: true,
    description: 'Suggested payment method extracted from the prompt.',
  })
  paymentMethod!: PaymentMethod | null;

  @ApiPropertyOptional({
    example: true,
    nullable: true,
    description: 'Whether the prompt indicates a signed contract.',
  })
  hasContract!: boolean | null;

  @ApiPropertyOptional({
    example: 'Client requested open format set until midnight',
    nullable: true,
    description: 'Relevant notes extracted from the prompt.',
  })
  notes!: string | null;

  @ApiPropertyOptional({
    example: 'DJ Orbit',
    nullable: true,
    description: 'Artist name mentioned in the prompt.',
  })
  artistName!: string | null;

  @ApiPropertyOptional({
    example: 'Maria Silva',
    nullable: true,
    description: 'Client name extracted from the prompt.',
  })
  clientName!: string | null;

  @ApiPropertyOptional({
    example: '+5521999999999',
    nullable: true,
    description: 'Client phone extracted from the prompt.',
  })
  clientPhone!: string | null;

  @ApiPropertyOptional({
    example: 'maria@email.com',
    nullable: true,
    description: 'Client email extracted from the prompt.',
  })
  clientEmail!: string | null;

  @ApiPropertyOptional({
    example: 'Empresa XYZ',
    nullable: true,
    description: 'Client company or brand extracted from the prompt.',
  })
  clientCompanyName!: string | null;
}
