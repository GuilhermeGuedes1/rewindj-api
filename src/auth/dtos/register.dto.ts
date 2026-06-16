import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Guilherme',
    description: 'First name of the owner user created with the organization.',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'Guedes',
    description: 'Last name of the owner user created with the organization.',
  })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({
    example: 'guilherme@email.com',
    description: 'Unique login email for the owner user.',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: '+5521999999999',
    description: 'Unique phone number for the owner user.',
  })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({
    example: '123456',
    description: 'Password used to authenticate the owner user.',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    example: 'Orbit Agency',
    description: 'Name of the tenant organization, agency, or DJ business.',
  })
  @IsString()
  @IsNotEmpty()
  organizationName!: string;

  @ApiProperty({
    example: 'contato@orbitagency.com',
    description: 'Unique contact email for the tenant organization.',
  })
  @IsEmail()
  @IsNotEmpty()
  organizationEmail!: string;

  @ApiProperty({
    example: '12.345.678/0001-90',
    description:
      'Unique business document for the tenant organization, such as CNPJ.',
  })
  @IsString()
  @IsNotEmpty()
  organizationDocument!: string;
}
