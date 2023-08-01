import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../constants';
import { ERole } from '../enums/role.enum';

export const Roles = (...roles: ERole[]) => SetMetadata(ROLES_KEY, roles);
