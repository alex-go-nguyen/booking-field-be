import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import User from './entities/user.entity';

interface RequestWithUser extends Request {
  user: User;
}

export const CurrentUser = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest<RequestWithUser>();

  return data ? user?.[data] : user;
});
