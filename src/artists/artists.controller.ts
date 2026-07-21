import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guards';
import { CurrentUserDto } from '../auth/dtos/user.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ArtistsService } from './artists.service';
import { ArtistResponseDto } from './dtos/artist-response.dto';
import { EventResponseDto } from './dtos/event-response.dto';
import { UpdateArtistDto } from './dtos/update-artist-dto';
import { RegisterArtistDto } from './dtos/register-artist.dto';

@ApiTags('Artists')
@ApiBearerAuth()
@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @ApiOperation({
    summary: 'List artists from the authenticated organization',
    description:
      'Returns the artist roster that belongs to the same organization tenant as the authenticated user.',
  })
  @ApiOkResponse({
    description: 'Artists returned successfully.',
    type: ArtistResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
  @UseGuards(AuthGuard)
  @Get()
  findAll(@CurrentUser() user: CurrentUserDto) {
    return this.artistsService.findAll(user);
  }

  @ApiOperation({
    summary: 'List events assigned to the authenticated artist',
    description:
      'Returns the schedule for the artist profile linked to the authenticated user.',
  })
  @ApiOkResponse({
    description: 'Artist events returned successfully.',
    type: EventResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
  @ApiNotFoundResponse({
    description: 'The authenticated user does not have an artist profile.',
  })
  @UseGuards(AuthGuard)
  @Get('/me/events')
  getEvents(@CurrentUser() user: CurrentUserDto) {
    return this.artistsService.getEvents(user);
  }

  @ApiOperation({
    summary: 'Get the authenticated artist profile',
    description:
      'Returns the artist profile linked to the authenticated user account.',
  })
  @ApiOkResponse({
    description: 'Artist profile returned successfully.',
    type: ArtistResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
  @ApiNotFoundResponse({
    description: 'The authenticated user does not have an artist profile.',
  })
  @UseGuards(AuthGuard)
  @Get('me')
  me(@CurrentUser() user: CurrentUserDto) {
    return this.artistsService.getMe(user);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  updateMe(@Body() data: UpdateArtistDto, @CurrentUser() user: CurrentUserDto) {
    return this.artistsService.updateMe(data, user);
  }

  @ApiOperation({
    summary: 'Show artist by id',
    description: 'Returns artist profile linked to the authenticated user.',
  })
  @ApiOkResponse({
    description: 'Artist data returned successfully.',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
  @ApiNotFoundResponse({
    description: 'The authenticated user does not have an artist profile.',
  })
  @UseGuards(AuthGuard)
  @Get(':id')
  getArtistById(@Param('id') id: string, @CurrentUser() user: CurrentUserDto) {
    return this.artistsService.getArtistById(id, user);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateArtist(
    @Param('id') id: string,
    @Body() data: UpdateArtistDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.artistsService.updateArtist(id, data, user);
  }

  @ApiOperation({
    summary: 'Register an independent Artist account',
    description:
      'Creates a new organization, CEO user and artist profile in a single transaction.',
  })
  @Post('register')
  registerArtist(@Body() data: RegisterArtistDto) {
    return this.artistsService.registerArtist(data);
  }
}
