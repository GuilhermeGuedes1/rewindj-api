import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { createClientDto } from './dtos/create-client.dto';
import { AuthGuard } from 'src/auth/auth.guards';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateClientResponseDto } from './dtos/client-response.dto';

@ApiTags('Clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiOperation({
    summary: 'Create a new client',
    description:
      'Protected endpoint for validating and registering client contact details for the authenticated context.',
  })
  @ApiBody({ type: createClientDto })
  @ApiCreatedResponse({
    description: 'Creates a client and returns the payload.',
    type: CreateClientResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Request body failed validation.' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid bearer token.',
  })
  @UseGuards(AuthGuard)
  @Post('create')
  createClient(@Body() body: createClientDto) {
    return this.clientsService.createClient(body);
  }
}
