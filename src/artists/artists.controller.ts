import { Controller, Get, UseGuards } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { AuthGuard } from 'src/auth/auth.guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CurrentUserDto } from 'src/auth/dtos/user.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('artists')
export class ArtistsController {
  constructor(private readonly artistService: ArtistsService) {}
  @Get()
  getArtists(@CurrentUser() user: CurrentUserDto) {
    return this.artistService.getArtists(user);
  }
}
