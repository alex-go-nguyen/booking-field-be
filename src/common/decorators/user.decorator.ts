import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import User from 'src/user/entities/user.entity';

export const ReqUser = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest<{ user: User }>();
  return user;
});
