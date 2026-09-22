import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Prisma, Role } from 'src/generated/prisma/client';
import { CurrentUserDto } from './dtos/user.dto';

export function buildEventAuthorizationWhere(
  user: CurrentUserDto,
): Prisma.EventWhereInput {
  if (user.role === Role.ARTIST && user.isIndependent) {
    if (!user.artistId) {
      throw new ForbiddenException(
        'Independent artist has no linked artist profile',
      );
    }

    return {
      organizationId: null,
      artistId: user.artistId,
    };
  }

  if (!user.organizationId) {
    throw new UnauthorizedException('Authenticated user has no organization');
  }

  const where: Prisma.EventWhereInput = {
    organizationId: user.organizationId,
  };

  if (user.role === Role.ARTIST) {
    if (!user.artistId) {
      throw new ForbiddenException(
        'Artist account has no linked artist profile',
      );
    }

    where.artistId = user.artistId;
  }

  return where;
}
