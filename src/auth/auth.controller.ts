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
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './auth.guards';
import { CurrentUser } from './decorators/user.decorator';
import { CurrentUserDto } from './dtos/user.dto';
import { UserResponseDto } from './dtos/users-response.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Register a new organization and owner account',
  })
  @ApiCreatedResponse({
    description:
      'Creates an organization, its owner user, and returns a token.',
  })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(body);

    return {
      message: 'User registered successfully',
      user,
    };
  }

  @ApiOperation({
    summary: 'Authenticate a user and return an access token',
  })
  @ApiCreatedResponse({
    description: 'Authenticates the user and returns a JWT access token.',
  })
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the authenticated user profile',
  })
  @ApiOkResponse({
    description: 'Returns the authenticated user profile.',
    type: CurrentUserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: CurrentUserDto) {
    return new CurrentUserDto(user);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List users from the authenticated organization',
  })
  @ApiOkResponse({
    description: 'Returns all users from the authenticated organization.',
    type: UserResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
  @UseGuards(AuthGuard)
  @Get('users')
  getUsers(@CurrentUser() user: CurrentUserDto) {
    return this.authService.getUsers(user.organizationId);
  }
}
