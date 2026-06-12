import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { createClientDto } from './dtos/create-client.dto';
import { AuthGuard } from 'src/auth/auth.guards';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiOperation({ summary: 'Create a new client' })
  @ApiCreatedResponse({
    description: 'Creates a client and returns the payload.',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid bearer token.',
  })
  @UseGuards(AuthGuard)
  @Post('create')
  createClient(@Body() body: createClientDto) {
    return this.clientsService.createClient(body);
  }
}
