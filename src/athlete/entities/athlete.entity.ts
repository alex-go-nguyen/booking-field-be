import { TABLES } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity(TABLES.athlete)
export class Athlete extends Base {
  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  number: string;
}
