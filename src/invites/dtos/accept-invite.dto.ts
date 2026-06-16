import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional } from 'class-validator';

export class AcceptInviteDto {
  @ApiProperty({
    example: 'John',
    description: 'First name for the user account created from the invite.',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name for the user account created from the invite.',
  })
  @IsString()
  lastName!: string;

  @ApiProperty({
    example: '+5521999999999',
    description: 'Unique phone number for the invited user.',
  })
  @IsString()
  phone!: string;

  @ApiProperty({
    example: '123456',
    description: 'Password for the invited user account.',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({
    example: 'DJ Orbit',
    description:
      'Public artist stage name. Used only when the invited role is ARTIST; defaults to full name when omitted.',
  })
  @IsString()
  @IsOptional()
  stageName?: string;
}
