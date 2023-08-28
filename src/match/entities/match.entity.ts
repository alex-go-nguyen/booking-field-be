import { TABLES } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { Team } from 'src/team/entities/team.entity';
import { Column, Entity } from 'typeorm';

@Entity(TABLES.match)
export class Match extends Base {
  @Column({ type: 'jsonb' })
  hostId: Team;

  @Column({ type: 'jsonb' })
  guest: Team;

  @Column()
  time: Date;

  @Column({ default: 0 })
  hostGoals: number;

  @Column({ default: 0 })
  guestGoals: number;
}
