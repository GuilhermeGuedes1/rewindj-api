import { ForbiddenException } from '@nestjs/common';
import { Role } from 'src/generated/prisma/client';
import { CurrentUserDto } from './dtos/user.dto';

export function ensureCanManageOrganization(user: CurrentUserDto): void {
  if (user.role === Role.ARTIST) {
    throw new ForbiddenException(
      'Artist accounts cannot manage organization resources',
    );
  }
}
