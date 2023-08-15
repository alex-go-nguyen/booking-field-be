import { RoleEnum } from 'src/common/enums/role.enum';
import User from 'src/user/entities/user.entity';
import { define } from 'typeorm-seeding';

define(User, () => {
  const user = new User();
  user.username = 'admin';
  user.email = 'admin@gmail.com';
  user.firstName = 'Admin';
  user.lastName = 'Main';
  user.password = 'admin123';
  user.phone = '0123456789';
  user.role = RoleEnum.Admin;

  return user;
});
