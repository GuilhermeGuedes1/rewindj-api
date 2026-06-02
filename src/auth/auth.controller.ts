import { Controller, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register() {
    return { message: 'Registration successful' };
  }

  @Post('login')
  login() {
    return { message: 'Login successful' };
  }

  @Get('users')
  getUsers() {
    return this.authService.getUsers();
  }
}
