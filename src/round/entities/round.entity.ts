import { TABLES } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { Match } from 'src/match/entities/match.entity';
import { Tournament } from 'src/tournament/entities/tournament.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity(TABLES.round)
export class Round extends Base {
  @Column()
  no: number;

  @OneToMany(() => Match, (match) => match.round)
  matches: Match[];

  @ManyToOne(() => Tournament, (tournament) => tournament.rounds)
  tournament: Tournament;
}
