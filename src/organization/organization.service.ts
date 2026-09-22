import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../generated/prisma/client';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { CurrentUserDto } from '../auth/dtos/user.dto';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateOrganizationDto, currentUser: CurrentUserDto) {
    if (
      currentUser.role !== Role.ARTIST ||
      !currentUser.isIndependent ||
      currentUser.organizationId !== null
    ) {
      throw new UnauthorizedException(
        'Only independent artists can create an organization',
      );
    }

    const existingOrganization = await this.prisma.organization.findFirst({
      where: {
        OR: [{ document: data.document }, { email: data.email }],
      },
    });

    if (existingOrganization) {
      throw new ConflictException(
        'Organization document or email already exists',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: data.name,
          document: data.document,
          email: data.email,
        },
      });

      await tx.artist.update({
        where: {
          id: currentUser.artistId,
        },
        data: {
          organizationId: organization.id,
          isIndependent: false,
          role: Role.CEO,
        },
      });

      return organization;
    });
  }
}
