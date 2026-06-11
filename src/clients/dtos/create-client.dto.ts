import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class createClientDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;
}
