import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from 'src/common/constants';
import { RoleEnum } from 'src/common/enums/role.enum';
import User from 'src/user/entities/user.entity';
import { UserService } from 'src/user/users.service';
import { JwtAuthGuard } from './auth.guard';

@Injectable()
export class RoleGuard extends JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector, protected jwtService: JwtService, protected userService: UserService) {
    super(jwtService, userService);
  }

  async canActivate(context: ExecutionContext) {
    const isAuth = await super.canActivate(context);

    if (!isAuth) return false;

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
