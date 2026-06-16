import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Artist } from 'src/generated/prisma/client';

export class ArtistResponseDto {
  @ApiProperty({
    example: 'c4c49f6c-0b0c-4e7f-a92f-1c8d7c6b9d8e',
    description: 'Artist identifier.',
  })
  id: string;

  @ApiProperty({
    example: 'Joao Pereira',
    description: 'Artist full legal or registration name.',
  })
  fullName: string;

  @ApiProperty({
    example: 'DJ Orbit',
    description: 'Artist public stage name.',
  })
  stageName: string;

  @ApiPropertyOptional({
    example: '1995-04-12T00:00:00.000Z',
    nullable: true,
    description: 'Artist birth date when registered.',
  })
  birthDate: Date | null;

  @ApiPropertyOptional({
    example: '+5521999999999',
    nullable: true,
    description: 'Artist phone number.',
  })
  phone: string | null;

  @ApiPropertyOptional({
    example: 'dj.orbit@email.com',
    nullable: true,
    description: 'Artist contact email.',
  })
  email: string | null;

  @ApiPropertyOptional({
    example: 'Rua das Palmeiras, 100',
    nullable: true,
    description: 'Artist street address.',
  })
  address: string | null;

  @ApiPropertyOptional({
    example: 'Sao Paulo',
    nullable: true,
    description: 'Artist city.',
  })
  city: string | null;

  @ApiPropertyOptional({
    example: 'SP',
    nullable: true,
    description: 'Artist state or region.',
  })
  state: string | null;

  @ApiPropertyOptional({
    example: 'dj.orbit@pix.com.br',
    nullable: true,
    description: 'Artist PIX key used for payments.',
  })
  pixKey: string | null;

  @ApiProperty({
    example: '2026-06-16T12:00:00.000Z',
    description: 'Artist creation timestamp.',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-06-16T12:00:00.000Z',
    description: 'Artist last update timestamp.',
  })
  updatedAt: Date;

  constructor(artist: Artist) {
    this.id = artist.id;
    this.fullName = artist.fullName;
    this.stageName = artist.stageName;

    this.birthDate = artist.birthDate;

    this.phone = artist.phone;
    this.email = artist.email;

    this.address = artist.address;
    this.city = artist.city;
    this.state = artist.state;

    this.pixKey = artist.pixKey;

    this.createdAt = artist.createdAt;
    this.updatedAt = artist.updatedAt;
  }
}
