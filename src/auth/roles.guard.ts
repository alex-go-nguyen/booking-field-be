import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from 'src/common/constants';
import { ERole } from 'src/common/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<ERole>(ROLE_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRole) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    return requiredRole === user.role;
  }
}
