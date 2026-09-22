import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import { PrismaService } from 'src/prisma/prisma.service';
import { CurrentUserDto } from '../auth/dtos/user.dto';
import { CreateInviteDto } from './dtos/create-invite.dto';
import { AcceptInviteDto } from './dtos/accept-invite.dto';
import { InviteStatus } from '../generated/prisma/client';
import { ensureCanManageOrganization } from 'src/auth/organization-authorization';

@Injectable()
export class InvitesService {
  constructor(private readonly prisma: PrismaService) {}

  async createInvite(user: CurrentUserDto, data: CreateInviteDto) {
    if (!user.organizationId) {
      throw new UnauthorizedException('User has no organization');
    }

    ensureCanManageOrganization(user);

    const creator = await this.prisma.artist.findUnique({
      where: {
        userId: user.sub,
      },
      select: {
        id: true,
      },
    });

    if (!creator) {
      throw new BadRequestException('Authenticated user has no artist profile');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
      include: {
        artist: true,
      },
    });

    if (
      existingUser?.artist &&
      existingUser.artist.organizationId === user.organizationId
    ) {
      throw new ConflictException(
        'User is already a member of this organization',
      );
    }

    const pendingInvite = await this.prisma.invite.findFirst({
      where: {
        email: data.email,
        organizationId: user.organizationId,
        status: InviteStatus.PENDING,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (pendingInvite) {
      throw new ConflictException(
        'There is already a pending invite for this email',
      );
    }

    const token = randomUUID();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    const invite = await this.prisma.invite.create({
      data: {
        email: data.email,
        role: data.role,
        token,
        organizationId: user.organizationId,
        createdById: user.sub,
        createdByArtistId: creator.id,
        expiresAt,
      },
    });

    return {
      message: 'Invite created successfully',
      invite: `${process.env.FRONTEND_URL}/invites/accept?token=${invite.token}`,
    };
  }

  async findByToken(token: string) {
    const invite = await this.prisma.invite.findUnique({
      where: {
        token,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException('Invite is no longer valid');
    }

    if (invite.expiresAt < new Date()) {
      throw new BadRequestException('Invite expired');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: invite.email,
      },
      select: {
        id: true,
      },
    });

    return {
      id: invite.id,
      email: invite.email,
      role: invite.role,
      organization: invite.organization,
      expiresAt: invite.expiresAt,
      existingUser: !!existingUser,
    };
  }

  async accept(token: string, data: AcceptInviteDto) {
    const invite = await this.prisma.invite.findUnique({
      where: {
        token,
      },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    if (invite.status !== InviteStatus.PENDING) {
      throw new BadRequestException('Invite is no longer valid');
    }

    if (invite.expiresAt < new Date()) {
      throw new BadRequestException('Invite expired');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: invite.email,
      },
      include: {
        artist: true,
      },
    });

    /**
     * ============================================================
     * CASO 1
     * Usuário já existe
     * ============================================================
     */
    if (existingUser) {
      if (!existingUser.artist) {
        throw new ConflictException('User does not have an artist profile');
      }

      if (existingUser.artist.organizationId) {
        throw new ConflictException(
          'User is already a member of an organization',
        );
      }

      await this.prisma.$transaction(async (tx) => {
        await tx.artist.update({
          where: {
            id: existingUser.artist!.id,
          },
          data: {
            role: invite.role,
            organizationId: invite.organizationId,
            isIndependent: false,
          },
        });

        await tx.invite.update({
          where: {
            id: invite.id,
          },
          data: {
            status: InviteStatus.ACCEPTED,
            acceptedAt: new Date(),
          },
        });
      });

      return {
        message: 'Invite accepted successfully',
        existingUser: true,
      };
    }

    /**
     * ============================================================
     * CASO 2
     * Usuário ainda não existe
     * ============================================================
     */

    if (!data.password) {
      throw new BadRequestException(
        'Password is required to create an account',
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: invite.email,
          password: passwordHash,
        },
      });

      await tx.artist.create({
        data: {
          name: null,
          stageName: null,
          phone: null,
          role: invite.role,
          isIndependent: false,
          organizationId: invite.organizationId,
          userId: createdUser.id,
        },
      });

      await tx.invite.update({
        where: {
          id: invite.id,
        },
        data: {
          status: InviteStatus.ACCEPTED,
          acceptedAt: new Date(),
        },
      });
    });

    return {
      message: 'Invite accepted successfully',
      existingUser: false,
    };
  }
}
