import { TABLES } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity(TABLES.pitchCategory)
export class PitchCategory extends Base {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  thumbnail: string;

  @OneToMany(() => Pitch, (pitch) => pitch.pitchCategory)
  pitches: Pitch[];
}
