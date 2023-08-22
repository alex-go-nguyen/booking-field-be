import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/constants';
import { RoleEnum } from 'src/common/enums/role.enum';
import User from 'src/user/entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    try {
      const { user } = context.switchToHttp().getRequest<{ user: User }>();

      return requiredRoles.some((role) => user.role === role);
    } catch (error) {
      return false;
    }
  }
}
