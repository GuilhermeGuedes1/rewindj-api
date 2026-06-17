import { Injectable } from '@nestjs/common';
import { CurrentUserDto } from '../auth/dtos/user.dto';
import { CreateInviteDto } from './dtos/create-invite.dto';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InviteStatus } from '../generated/prisma/client';
import { AcceptInviteDto } from './dtos/accept-invite.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InvitesService {
  constructor(private readonly prisma: PrismaService) {}

  async createInvite(user: CurrentUserDto, data: CreateInviteDto) {
    const token = randomUUID();

    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 1);

    const invit = await this.prisma.invite.create({
      data: {
        email: data.email,
        role: data.role,
        token,
        organizationId: user.organizationId,
        createdById: user.sub,
        expiresAt,
      },
    });

    return {
      message: 'invite created successfully',
      invite: `http://localhost:3000/invites/accept?token=${invit.token}`,
    };
  }

  async findByToken(token: string) {
    const invite = await this.prisma.invite.findUnique({
      where: { token },
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

    return {
      id: invite.id,
      email: invite.email,
      role: invite.role,
      organization: invite.organization,
      expiresAt: invite.expiresAt,
    };
  }

  async accept(token: string, data: AcceptInviteDto) {
    const invite = await this.prisma.invite.findUnique({
      where: { token },
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

    const userAlreadyExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: invite.email }, { phone: data.phone }],
      },
    });

    if (userAlreadyExists) {
      throw new ConflictException('User already exists');
    }

    const [name, ...lastNameParts] = data.fullName.trim().split(/\s+/);
    const lastName = lastNameParts.join(' ') || name;

    const passwordHash = await bcrypt.hash(data.password, 10);

    await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name,
          lastName,
          email: invite.email,
          phone: data.phone,
          password: passwordHash,
          role: invite.role,
          organizationId: invite.organizationId,
        },
      });

      if (invite.role === 'ARTIST') {
        await tx.artist.create({
          data: {
            fullName: data.fullName,
            stageName: data.stageName || data.fullName,
            birthDate: data.birthDate ? new Date(data.birthDate) : null,
            phone: data.phone,
            email: invite.email,
            address: data.address,
            city: data.city,
            state: data.state,
            pixKey: data.pixKey,
            organizationId: invite.organizationId,
            userId: createdUser.id,
          },
        });
      }

      await tx.invite.update({
        where: { id: invite.id },
        data: {
          status: InviteStatus.ACCEPTED,
          acceptedAt: new Date(),
        },
      });
    });

    return {
      message: 'Invite accepted successfully',
    };
  }
}
