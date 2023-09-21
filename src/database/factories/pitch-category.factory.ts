import { PitchCategory } from 'src/pitch-category/entities/pitch-category.entity';
import { define } from 'typeorm-seeding';

define(PitchCategory, () => {
  const pitchCategory = new PitchCategory();

  return pitchCategory;
});
