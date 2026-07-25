import { ForbiddenException } from '@nestjs/common';
import { Role } from 'src/generated/prisma/client';
import { CurrentUserDto } from './dtos/user.dto';

/**
 * Organization management endpoints are reserved for the existing
 * non-artist roles (CEO, ADMIN, and PRODUCER).
 */
export function ensureCanManageOrganization(user: CurrentUserDto): void {
  if (user.role === Role.ARTIST) {
    throw new ForbiddenException(
      'Artist accounts cannot manage organization resources',
    );
  }
}
