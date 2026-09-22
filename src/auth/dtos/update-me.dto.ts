import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateMeDto {
  @ApiPropertyOptional({
    example: 'Guilherme Guedes',
    description: 'User display name.',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: '+5521999999999',
    description: 'User phone number.',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'DJ Guedes',
    description: 'Artist stage name.',
  })
  @IsOptional()
  @IsString()
  stageName?: string;

  @ApiPropertyOptional({
    example: '1996-02-14',
    description: 'Artist birth date.',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({
    example: 'Rua das Palmeiras, 123',
    description: 'Artist address.',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: 'Rio de Janeiro',
    description: 'Artist city.',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    example: 'RJ',
    description: 'Artist state.',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    example: 'pix@email.com',
    description: 'Artist Pix key.',
  })
  @IsOptional()
  @IsString()
  pixKey?: string;
}
