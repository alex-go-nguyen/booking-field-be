import { SetMetadata } from '@nestjs/common';
import { ROLE_KEY } from '../constants';
import { ERole } from '../enums/role.enum';

export const Role = (role: ERole) => SetMetadata(ROLE_KEY, role);
