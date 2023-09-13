import { TABLES } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { Match } from 'src/match/entities/match.entity';
import { Tournament } from 'src/tournament/entities/tournament.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity(TABLES.team)
export class Team extends Base {
  @Column()
  name: string;

  @Column()
  avatar: string;

  @Column({ nullable: true })
  contact: string;

  @OneToMany(() => Match, (match) => match.host)
  @OneToMany(() => Match, (match) => match.guest)
  matches: Match[];

  @ManyToOne(() => Tournament, (tournament) => tournament.teams)
  tournament: Tournament;
}
