import { SetMetadata } from '@nestjs/common';
import { ROLE_KEY } from '../constants';
import { RoleEnum } from '../enums/role.enum';

export const Role = (role: RoleEnum) => SetMetadata(ROLE_KEY, role);
