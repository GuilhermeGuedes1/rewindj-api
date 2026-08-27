import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Artist } from 'src/generated/prisma/client';

export class ArtistResponseDto {
  @ApiProperty({
    example: 'c4c49f6c-0b0c-4e7f-a92f-1c8d7c6b9d8e',
    description: 'Artist identifier.',
  })
  id: string;

  @ApiPropertyOptional({
    example: 'Joao Pereira',
    nullable: true,
    description: 'Artist full legal or registration name.',
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'DJ Orbit',
    nullable: true,
    description: 'Artist public stage name.',
  })
  stageName?: string;

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

  @ApiPropertyOptional({
    example: 'users/77d3f7a7-c4e8-41e4-9f71-a2de4b580a85-testeImagem.png',
    nullable: true,
    description: 'S3 key of the artist profile image.',
  })
  profileImageKey: string | null;

  constructor(artist: Artist) {
    this.id = artist.id;
    this.name = artist.name ?? undefined;
    this.stageName = artist.stageName ?? undefined;

    this.birthDate = artist.birthDate;

    this.phone = artist.phone;
    this.address = artist.address;
    this.city = artist.city;
    this.state = artist.state;

    this.pixKey = artist.pixKey;

    this.createdAt = artist.createdAt;
    this.updatedAt = artist.updatedAt;

    this.profileImageKey = artist.profileImageKey;
  }
}
