import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class createClientDto {
  @ApiProperty({
    example: 'Maria Silva',
    description: 'Client name used for event contact and booking records.',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'maria@email.com',
    description: 'Client email address.',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: '+5521999999999',
    description: 'Client phone number.',
  })
  @IsString()
  @IsNotEmpty()
  phone!: string;
}
