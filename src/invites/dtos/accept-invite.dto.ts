import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class AcceptInviteDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full artist name.',
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    example: 'DJ Orbit',
    description: 'Public artist stage name.',
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

  @ApiProperty({
    example: '+5521999999999',
    description: 'Unique phone number for the invited user.',
  })
  @IsString()
  phone!: string;

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

  @ApiProperty({
    example: '123456',
    description: 'Password for the invited user account.',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
