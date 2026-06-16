import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './users-response.dto';

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description:
      'JWT bearer token used in the Authorize button and Authorization header.',
  })
  access_token!: string;
}

export class RegisterPayloadResponseDto extends LoginResponseDto {
  @ApiProperty({
    type: UserResponseDto,
    description: 'Created owner user for the new organization tenant.',
  })
  user!: UserResponseDto;
}

export class RegisterResponseDto {
  @ApiProperty({
    example: 'User registered successfully',
    description: 'Human-readable registration status message.',
  })
  message!: string;

  @ApiProperty({
    type: RegisterPayloadResponseDto,
    description: 'Authentication data returned by the registration flow.',
  })
  user!: RegisterPayloadResponseDto;
}
