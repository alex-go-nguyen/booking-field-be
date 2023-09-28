import { RoleEnum } from 'src/common/enums/role.enum';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import { PitchCategory } from 'src/pitch-category/entities/pitch-category.entity';
import User from 'src/user/entities/user.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Factory, Seeder } from 'typeorm-seeding';

const categoryData = [
  {
    name: 'Sân 5',
    description:
      'Sân 5 là một loại sân bóng đá nhỏ, thích hợp cho trận đấu 5 người mỗi đội. Trò chơi tập trung vào kỹ thuật cá nhân và đòi hỏi sự nhanh nhẹn trong không gian hạn chế.',
    thumbnail:
      'https://shopconhantao.com.vn/assets/cms/uploads/images/chi-phi-lam-san-bong/chi-phi-lam-san-bong-co-nhan-tao3.jpg',
  },
  {
    name: 'Sân 7',
    description:
      'Sân 7 là một tùy chọn trung bình giữa sân nhỏ 5 người và sân lớn 11 người. Với 7 người mỗi đội, trận đấu diễn ra trên một sân rộng hơn, đòi hỏi sự kết hợp và chiến thuật hơn.',
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR_SzGusU_5fDMUvqaV1f6Vl0N_dgTTUNsgQ&usqp=CAU',
  },
  {
    name: 'Sân 11',
    description:
      'Sân 11 là sân bóng đá truyền thống với 11 người mỗi đội. Đây là mô hình phổ biến nhất của bóng đá và đòi hỏi sự cơ động, sự phối hợp đội hình và khả năng chơi trong không gian rộng lớn.',
    thumbnail: 'https://conhantaonguyengia.com/uploads/2015/03/Co-nhan-tao-san-bong-da-Nguyen-Gia-1.jpg',
  },
  {
    name: 'Sân Futsal',
    description:
      'Sân Futsal là một sân nhỏ hơn dành riêng cho trò chơi futsal. Với 5 người mỗi đội, futsal tập trung vào kỹ thuật, điều khiển bóng, và trò chơi nhanh chóng trên một bề mặt sân nhân tạo.',
    thumbnail: 'https://media.diadiem247.com/uploads/w900/2021/06/19/fu1.jpg',
  },
];

export default class InitialDatabaseSeed implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(User)({ role: RoleEnum.Admin }).create({
      username: 'root',
      password: 'root123',
      email: 'thanhnduy143.tna@gmail.com',
      firstName: 'Pro vip',
      lastName: 'Admin',
      phone: '0354560042',
      favorites: null,
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
