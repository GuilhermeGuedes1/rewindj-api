import { ApiProperty } from '@nestjs/swagger';

export class CurrentUserDto {
  @ApiProperty({
    example: '4c2af2a9-3d2b-4a47-8d4f-7b8b29b5d7a2',
    description: 'Authenticated user identifier stored in the JWT subject.',
  })
  sub!: string;

  @ApiProperty({
    example: 'Guilherme',
    description: 'Authenticated user first name.',
  })
  name!: string;

  @ApiProperty({
    example: 'guilherme@email.com',
    description: 'Authenticated user email address.',
  })
  email!: string;

  @ApiProperty({
    example: '8e97d45f-b02f-4e2d-a83c-1c6eaa0474f4',
    description: 'Organization tenant identifier associated with the user.',
  })
  organizationId!: string;

  constructor(data: CurrentUserDto) {
    Object.assign(this, data);
  }
}
