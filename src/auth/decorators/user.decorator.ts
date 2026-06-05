import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserDto } from '../dtos/user.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return new CurrentUserDto(request.user);
  },
);
