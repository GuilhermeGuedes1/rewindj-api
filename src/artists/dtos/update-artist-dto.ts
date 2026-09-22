import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateArtistDto {
  @ApiPropertyOptional({
    example: 'Joao Pereira',
    description: 'Artist full legal or registration name.',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'DJ Orbit',
    description: 'Artist public stage name.',
  })
  @IsOptional()
  @IsString()
  stageName?: string;

  @ApiPropertyOptional({
    example: '+5521999999999',
    nullable: true,
    description: 'Artist phone number.',
  })
  @IsOptional()
  @IsString()
  phone?: string | null;

  @ApiPropertyOptional({
    example: '1995-04-12',
    nullable: true,
    description: 'Artist birth date.',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string | null;

  @ApiPropertyOptional({
    example: 'Rua das Palmeiras, 100',
    nullable: true,
    description: 'Artist street address.',
  })
  @IsOptional()
  @IsString()
  address?: string | null;

  @ApiPropertyOptional({
    example: 'Sao Paulo',
    nullable: true,
    description: 'Artist city.',
  })
  @IsOptional()
  @IsString()
  city?: string | null;

  @ApiPropertyOptional({
    example: 'SP',
    nullable: true,
    description: 'Artist state or region.',
  })
  @IsOptional()
  @IsString()
  state?: string | null;

  @ApiPropertyOptional({
    example: 'dj.orbit@pix.com.br',
    nullable: true,
    description: 'Artist PIX key used for payments.',
  })
  @IsOptional()
  @IsString()
  pixKey?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    description: 'S3 key of the artist profile image.',
  })
  @IsOptional()
  @IsString()
  profileImageKey?: string | null;
}
