import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum } from 'class-validator';
import { Role } from '../../generated/prisma/client';

export class CreateInviteDto {
  @ApiProperty({
    example: 'artist@email.com',
    description:
      'Email address that will receive or use the invite. The user account is created only when the invite is accepted.',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    enum: Role,
    enumName: 'Role',
    example: Role.ARTIST,
    description:
      'Role that will be assigned to the invited user inside the organization.',
  })
  @IsEnum(Role)
  role!: Role;
}
