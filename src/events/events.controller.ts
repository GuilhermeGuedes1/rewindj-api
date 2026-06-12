import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import { EventsService } from './events.service';
import { AuthGuard } from 'src/auth/auth.guards';
import { CreateEventDto } from './dtos/create-event.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CurrentUserDto } from 'src/auth/dtos/user.dto';
import { EventResponseDto } from './event-response.dto';
import {
  ApiBearerAuth,
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

  @ApiOperation({ summary: 'Create a new event' })
  @ApiCreatedResponse({ description: 'Creates an event and returns it.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
  @UseGuards(AuthGuard)
  @Post('create')
  createEvent(
    @Body() body: CreateEventDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.eventsService.createEvent(body, user);
  }

  @ApiOperation({ summary: 'List events for the authenticated organization' })
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
}
