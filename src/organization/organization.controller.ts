import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CurrentUserDto } from 'src/auth/dtos/user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guards';

@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organization: OrganizationService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() data: CreateOrganizationDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.organization.create(data, user);
  }
}
