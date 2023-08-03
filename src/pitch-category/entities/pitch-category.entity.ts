import { Base } from 'src/common/entities/base.entity';
import { TABLE } from 'src/common/enums/table.enum';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity(TABLE.PitchCategory)
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
