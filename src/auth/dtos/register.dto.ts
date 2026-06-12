import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Guilherme',
    description: 'User first name',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'Guedes',
    description: 'User last name',
  })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({
    example: 'guilherme@email.com',
    description: 'User email',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: '+5521999999999',
    description: 'User phone number',
  })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({
    example: '123456',
    description: 'User password',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    example: 'Orbit Agency',
    description: 'Organization name',
  })
  @IsString()
  @IsNotEmpty()
  organizationName!: string;

  @ApiProperty({
    example: 'contato@orbitagency.com',
    description: 'Organization email',
  })
  @IsEmail()
  @IsNotEmpty()
  organizationEmail!: string;

  @ApiProperty({
    example: '12.345.678/0001-90',
    description: 'Organization document',
  })
  @IsString()
  @IsNotEmpty()
  organizationDocument!: string;
}
