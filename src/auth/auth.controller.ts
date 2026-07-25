import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  Patch,
} from '@nestjs/common';

import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './auth.guards';
import { CurrentUser } from './decorators/user.decorator';
import { CurrentUserDto } from './dtos/user.dto';
import { UserResponseDto } from './dtos/users-response.dto';
import { UpdateMeDto } from './dtos/update-me.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  LoginResponseDto,
  RegisterResponseDto,
} from './dtos/auth-response.dto';
import { MeResponseDto } from './dtos/me-response.dto';

type GoogleOAuthUser = {
  email?: string;
  googleId: string;
  name?: string;
  lastName?: string;
  avatarUrl?: string;
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Register a new organization and owner account',
    description:
      'Creates a new tenant organization and its first user. The created user receives the CEO role and can use the returned JWT to access protected organization resources.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description:
      'Organization and owner user created successfully. Returns a JWT for immediate authentication.',
    type: RegisterResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Request body failed validation.' })
  @ApiConflictResponse({
    description:
      'User, organization email, or organization document already exists.',
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
    description:
      'Validates user credentials and returns a JWT bearer token for protected endpoints.',
  })
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({
    description: 'Authenticates the user and returns a JWT access token.',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Request body failed validation.' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password.' })
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the authenticated user profile',
    description:
      'Returns the identity and tenant context decoded from the current JWT.',
  })
  @ApiOkResponse({
    description: 'Returns the authenticated user profile.',
    type: MeResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: CurrentUserDto) {
    return this.authService.getMe(user);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List users from the authenticated organization',
    description:
      'Returns all users that belong to the same organization tenant as the authenticated user.',
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
    return this.authService.getUsers(user);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update authenticated user account',
    description: 'Updates basic account data for the authenticated user.',
  })
  @ApiOkResponse({
    description: 'User account updated successfully.',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
  @UseGuards(AuthGuard)
  @Patch('me')
  updateMe(@CurrentUser() user: CurrentUserDto, @Body() body: UpdateMeDto) {
    return this.authService.updateMe(user, body);
  }

  @Get('google')
  @UseGuards(PassportAuthGuard('google'))
  googleAuth() {
    return;
  }

  @Get('google/callback')
  @UseGuards(PassportAuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    try {
      const googleUser = req.user as GoogleOAuthUser;
      const result = await this.authService.googleLogin(googleUser);

      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/google/callback?token=${result.accessToken}`,
      );
    } catch {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=google_account_not_found`,
      );
    }
  }
}
