import { Role } from 'src/generated/prisma/client';

export class CurrentUserDto {
  sub!: string;
  name!: string | null;
  email!: string;
  role!: Role;
  organizationId!: string | null;
  artistId!: string;
  isIndependent!: boolean;
}
