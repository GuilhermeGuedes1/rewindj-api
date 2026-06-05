import { Role } from '../../generated/prisma/client';

export class UserResponseDto {
  id!: string;
  name!: string;
  lastName!: string;
  email!: string;
  role!: Role;

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
