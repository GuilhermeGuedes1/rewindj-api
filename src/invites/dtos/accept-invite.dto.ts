import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AcceptInviteDto {
  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  @IsString()
  lastName!: string;

  @ApiProperty({
    example: '+5521999999999',
    description: 'User phone number',
  })
  @IsString()
  phone!: string;

  @ApiProperty({
    example: '123456',
    description: 'User password',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
