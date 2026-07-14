import { Body, Controller, UseGuards, Get, Param, Query } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { AuthGuard } from 'src/auth/auth.guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CurrentUserDto } from 'src/auth/dtos/user.dto';
import { PaginationDTO } from 'src/events/dtos/pagination-dto';

@UseGuards(AuthGuard)
@ApiTags('Clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  getClients(
    @Query() pagination: PaginationDTO,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.clientsService.getClients(user, pagination);
  }

  @Get(':id')
  getClientById(@Param('id') id: string, @CurrentUser() user: CurrentUserDto) {
    return this.clientsService.getClientById(id, user);
  }
}
