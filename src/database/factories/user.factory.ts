import { faker } from '@faker-js/faker/locale/vi';
import { RoleEnum } from 'src/common/enums/role.enum';
import User from 'src/user/entities/user.entity';
import { define } from 'typeorm-seeding';

define(User, () => {
  const user = new User();
  user.username = faker.internet.userName();
  user.email = faker.internet.email();
  user.firstName = faker.person.firstName();
  user.lastName = faker.person.lastName();
  user.password = faker.internet.password({ length: 10 });
  user.phone = faker.phone.number();
  user.role = RoleEnum.User;
  user.favorites = null;
  user.createdAt = faker.date.between({ from: '2022-01-01T00:00:00.000', to: '2023-12-31T00:00:00.000' });

  return user;
});
