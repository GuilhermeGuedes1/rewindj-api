import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../generated/prisma/client';

class UserOrganizationResponseDto {
  @ApiProperty({
    example: '8e97d45f-b02f-4e2d-a83c-1c6eaa0474f4',
    description: 'Organization identifier.',
  })
  id!: string;

  @ApiProperty({
    example: 'Orbit Agency',
    description: 'Organization display name.',
  })
  name!: string;

  @ApiProperty({
    example: 'contato@orbitagency.com',
    description: 'Organization contact email.',
  })
  email!: string;
}

export class UserResponseDto {
  @ApiProperty({
    example: '4c2af2a9-3d2b-4a47-8d4f-7b8b29b5d7a2',
    description: 'User identifier.',
  })
  id!: string;

  @ApiProperty({
    example: 'Guilherme',
    description: 'User first name.',
  })
  name!: string;

  @ApiProperty({
    example: 'Guedes',
    description: 'User last name.',
  })
  lastName!: string;

  @ApiProperty({
    example: 'guilherme@email.com',
    description: 'User email address.',
  })
  email!: string;

  @ApiProperty({
    enum: Role,
    enumName: 'Role',
    example: Role.ADMIN,
    description:
      'User permission level inside the organization tenant. CEO is the account owner.',
  })
  role!: Role;

  @ApiProperty({
    type: UserOrganizationResponseDto,
    description: 'Organization tenant to which the user belongs.',
  })
  organization!: {
    id: string;
    name: string;
    email: string;
  };

  constructor(data: Partial<UserResponseDto>) {
    this.id = data.id!;
    this.name = data.name!;
    this.lastName = data.lastName!;
    this.email = data.email!;
    this.role = data.role!;

    this.organization = {
      id: data.organization?.id ?? '',
      name: data.organization?.name ?? '',
      email: data.organization?.email ?? '',
    };
  }
}
