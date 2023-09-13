import { TABLES } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { Round } from 'src/round/entities/round.entity';
import { Team } from 'src/team/entities/team.entity';
import { Tournament } from 'src/tournament/entities/tournament.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

@Entity(TABLES.match)
export class Match extends Base {
  @ManyToOne(() => Team, (team) => team.matches)
  host: Team;

  @ManyToOne(() => Team, (team) => team.matches)
  guest: Team;

  @Column()
  time: Date;

  @Column({ default: 0 })
  hostGoals: number;

  @Column({ default: 0 })
  guestGoals: number;

  @ManyToOne(() => Round, (round) => round.matches)
  round: Round;
}
