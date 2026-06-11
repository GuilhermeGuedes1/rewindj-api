import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import { EventsService } from './events.service';
import { AuthGuard } from 'src/auth/auth.guards';
import { CreateEventDto } from './dtos/create-event.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CurrentUserDto } from 'src/auth/dtos/user.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  createEvent(
    @Body() body: CreateEventDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.eventsService.createEvent(body, user);
  }

  @UseGuards(AuthGuard)
  @Get()
  getEvents(@CurrentUser() user: CurrentUserDto) {
    return this.eventsService.getEvents(user);
  }
}
