import { TABLES } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity(TABLES.team)
export class Team extends Base {
  @Column()
  name: string;

  @Column()
  contact: string;
}
