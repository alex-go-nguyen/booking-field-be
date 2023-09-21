import { RoleEnum } from 'src/common/enums/role.enum';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import { PitchCategory } from 'src/pitch-category/entities/pitch-category.entity';
import User from 'src/user/entities/user.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Factory, Seeder } from 'typeorm-seeding';

import categoryData from '../data/category.json';

export default class InitialDatabaseSeed implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(User)({ role: RoleEnum.Admin }).create({
      username: 'root',
      password: 'root123',
      email: 'thanhnduy143.tna@gmail.com',
      firstName: 'Pro vip',
      lastName: 'Admin',
      phone: '0354560042',
      role: RoleEnum.Admin,
    });

    const pitchCategories: PitchCategory[] = [];
    for (const category of categoryData) {
      const newCategory = await factory(PitchCategory)().create(category);
      pitchCategories.push(newCategory);
    }

    await factory(User)().createMany(10, { role: RoleEnum.User });

    const usersWithOwnerRole = await factory(User)().createMany(25, { role: RoleEnum.Owner });

    const venues = await factory(Venue)()
      .map(async (venue) => {
        venue.user = usersWithOwnerRole.pop();

        return venue;
      })
      .createMany(25);

    await factory(Pitch)()
      .map(async (pitch) => {
        pitch.venue = venues[Math.floor(Math.random() * venues.length)];
        pitch.pitchCategory = pitchCategories[Math.floor(Math.random() * pitchCategories.length)];

        return pitch;
      })
      .createMany(50);
  }
}
