import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './auth.guards';
import { CurrentUser } from './decorators/user.decorator';
import { CurrentUserDto } from './dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(body);

    return {
      message: 'User registered successfully',
      user,
    };
  }

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.authService.create(body);
    return {
      message: 'User created successfully',
      user,
    };
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: CurrentUserDto) {
    return new CurrentUserDto(user);
  }
}
