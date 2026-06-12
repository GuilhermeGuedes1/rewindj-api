import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum } from 'class-validator';
import { Role } from '../../generated/prisma/client';

export class CreateInviteDto {
  @ApiProperty({
    example: 'artist@email.com',
    description: 'Email address of the invited user',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    enum: Role,
    example: Role.ARTIST,
    description: 'Role assigned to the invited user',
  })
  @IsEnum(Role)
  role!: Role;
}
