import { Controller, Post, UseGuards, Body, Get, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { AuthGuard } from 'src/auth/auth.guards';
import { CreateEventDto } from './dtos/create-event.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CurrentUserDto } from 'src/auth/dtos/user.dto';
import { CreateEventResponseDto, EventResponseDto } from './event-response.dto';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({
    summary: 'Create a new event',
    description:
      'Creates a booking for the authenticated organization, creates the client record supplied in the request, and links the selected artist.',
  })
  @ApiBody({ type: CreateEventDto })
  @ApiCreatedResponse({
    description:
      'Event created successfully with linked client and artist data.',
    type: CreateEventResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Request body failed validation.' })
  @ApiConflictResponse({
    description:
      'An event with the same title, artist, and date already exists.',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
  @UseGuards(AuthGuard)
  @Post('create')
  createEvent(
    @Body() body: CreateEventDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.eventsService.createEvent(body, user);
  }

  @ApiOperation({
    summary: 'List events for the authenticated organization',
    description:
      'Returns the authenticated tenant event schedule ordered by date, including linked artist and client summaries.',
  })
  @ApiOkResponse({
    description: 'Returns all events for the authenticated organization.',
    type: EventResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
  @UseGuards(AuthGuard)
  @Get()
  getEvents(@CurrentUser() user: CurrentUserDto) {
    return this.eventsService.getEvents(user);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getEventById(@Param('id') id: string, @CurrentUser() user: CurrentUserDto) {
    return this.eventsService.getEventById(id, user);
  }
}
