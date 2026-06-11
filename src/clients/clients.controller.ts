import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { createClientDto } from './dtos/create-client.dto';
import { AuthGuard } from 'src/auth/auth.guards';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  createClient(@Body() body: createClientDto) {
    return this.clientsService.createClient(body);
  }
}
