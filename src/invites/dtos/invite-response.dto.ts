import { ApiProperty } from '@nestjs/swagger';
import { InviteStatus, Role } from '../../generated/prisma/client';

class InviteOrganizationResponseDto {
  @ApiProperty({
    example: '8e97d45f-b02f-4e2d-a83c-1c6eaa0474f4',
    description: 'Organization identifier linked to the invite.',
  })
  id!: string;

  @ApiProperty({
    example: 'Orbit Agency',
    description: 'Organization name shown to the invited user.',
  })
  name!: string;

  @ApiProperty({
    example: 'contato@orbitagency.com',
    description: 'Organization contact email.',
  })
  email!: string;
}

export class CreateInviteResponseDto {
  @ApiProperty({
    example: 'invite created successfully',
    description: 'Human-readable invite creation status message.',
  })
  message!: string;

  @ApiProperty({
    example:
      'http://localhost:3000/invites/accept?token=2cb6b88f-2f29-4f57-9565-b403e0f2f973',
    description:
      'Invite URL containing the token that can be shared with the new member.',
  })
  invite!: string;
}

export class InviteStatusDocumentationDto {
  @ApiProperty({
    enum: InviteStatus,
    enumName: 'InviteStatus',
    example: InviteStatus.PENDING,
    description:
      'Invite lifecycle status used internally by Orbit to validate invite acceptance.',
  })
  status!: InviteStatus;
}

export class InviteByTokenResponseDto {
  @ApiProperty({
    example: 'f10d43f0-c56b-46f0-85bb-1fefad7e3b1e',
    description: 'Invite identifier.',
  })
  id!: string;

  @ApiProperty({
    example: 'artist@email.com',
    description: 'Email address associated with the invite.',
  })
  email!: string;

  @ApiProperty({
    enum: Role,
    enumName: 'Role',
    example: Role.ARTIST,
    description: 'Role that will be granted when the invite is accepted.',
  })
  role!: Role;

  @ApiProperty({
    type: InviteOrganizationResponseDto,
    description: 'Organization that created the invite.',
  })
  organization!: InviteOrganizationResponseDto;

  @ApiProperty({
    example: '2026-06-17T12:00:00.000Z',
    description: 'Expiration date and time for the invite token.',
  })
  expiresAt!: Date;
}

export class AcceptInviteResponseDto {
  @ApiProperty({
    example: 'Invite accepted successfully',
    description: 'Human-readable invite acceptance status message.',
  })
  message!: string;
}
