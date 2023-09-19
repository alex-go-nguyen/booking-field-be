import { TABLES } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { Match } from 'src/match/entities/match.entity';
import { Tournament } from 'src/tournament/entities/tournament.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity(TABLES.team)
export class Team extends Base {
  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ nullable: true })
  contactName: string;

  @Column({ default: 0 })
  matchesPlayed: number;

  @Column({ default: 0 })
  win: number;

  @Column({ default: 0 })
  draw: number;

  @Column({ default: 0 })
  lose: number;

  @Column({ default: 0 })
  point: number;

  @OneToMany(() => Match, (match) => match.host)
  @OneToMany(() => Match, (match) => match.guest)
  matches: Match[];

  @ManyToOne(() => Tournament, (tournament) => tournament.teams)
  tournament: Tournament;
}
