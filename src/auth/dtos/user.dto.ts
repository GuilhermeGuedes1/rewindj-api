import { AccountType, Role } from 'src/generated/prisma/client';

export class CurrentUserDto {
  sub!: string;
  name!: string;
  email!: string;
  role!: Role;
  organizationId!: string;
  organizationName!: string;
  artistId?: string | null;
  accountType!: AccountType;
}
