import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Role } from 'src/generated/prisma/client';
import { CurrentUserDto } from '../dtos/user.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request as Request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: unknown = await this.jwtService.verifyAsync(token);

      if (!this.isValidCurrentUserPayload(payload)) {
        throw new UnauthorizedException();
      }

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }

  private isValidCurrentUserPayload(
    payload: unknown,
  ): payload is CurrentUserDto {
    if (!payload || typeof payload !== 'object') {
      return false;
    }

    const candidate = payload as Record<string, unknown>;

    return (
      typeof candidate.sub === 'string' &&
      (candidate.name === null || typeof candidate.name === 'string') &&
      typeof candidate.email === 'string' &&
      typeof candidate.artistId === 'string' &&
      typeof candidate.role === 'string' &&
      Object.values(Role).includes(candidate.role as Role) &&
      (typeof candidate.organizationId === 'string' ||
        candidate.organizationId === null) &&
      typeof candidate.isIndependent === 'boolean'
    );
  }
}
