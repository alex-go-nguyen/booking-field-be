import { RoleEnum } from 'src/common/enums/role.enum';
import User from 'src/user/entities/user.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class InitialDatabaseSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    // await connection
    //   .createQueryBuilder()
    //   .insert()
    //   .into(User)
    //   .values({
    //     username: 'root',
    //     password: 'root',
    //     email: 'thanhnduy143@gmail.com',
    //     firstName: 'Dep trai',
    //     lastName: 'Admin',
    //     phone: '0354560042',
    //     role: RoleEnum.Admin,
    //   })
    //   .execute();

    await factory(User)().create({
      username: 'root',
      password: 'root',
      email: 'thanhnduy143.tna@gmail.com',
      firstName: 'Dep trai',
      lastName: 'Admin',
      phone: '0354560042',
      role: RoleEnum.Admin,
    });
  }
}
