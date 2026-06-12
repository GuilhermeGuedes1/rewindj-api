import { Controller, Post, Get, UseGuards, Body, Param } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { AuthGuard } from '../auth/auth.guards';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CurrentUserDto } from '../auth/dtos/user.dto';
import { CreateInviteDto } from './dtos/create-invite.dto';
import { AcceptInviteDto } from './dtos/accept-invite.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Invites')
@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create an invitation for a new organization member',
  })
  @ApiCreatedResponse({
    description: 'Creates an invite and returns the invite link.',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid bearer token.',
  })
  @UseGuards(AuthGuard)
  @Post()
  createInvite(
    @CurrentUser() user: CurrentUserDto,
    @Body() body: CreateInviteDto,
  ) {
    return this.invitesService.createInvite(user, body);
  }

  @ApiOperation({
    summary: 'Get invite details by token',
  })
  @ApiOkResponse({
    description: 'Returns the invite information for the token.',
  })
  @Get(':token')
  findByToken(@Param('token') token: string) {
    return this.invitesService.findByToken(token);
  }

  @ApiOperation({
    summary: 'Accept an invite token',
  })
  @ApiCreatedResponse({
    description: 'Accepts the invite and creates the user.',
  })
  @Post(':token/accept')
  acceptInvite(@Param('token') token: string, @Body() body: AcceptInviteDto) {
    return this.invitesService.accept(token, body);
  }
}
