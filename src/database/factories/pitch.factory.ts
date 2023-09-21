import { faker } from '@faker-js/faker/locale/vi';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import { define } from 'typeorm-seeding';

define(Pitch, () => {
  const pitch = new Pitch();

  pitch.name = `Sân ${faker.number.int({ min: 1, max: 10 })}`;
  pitch.price = faker.number.int({ min: 100000, max: 500000 });

  return pitch;
});
