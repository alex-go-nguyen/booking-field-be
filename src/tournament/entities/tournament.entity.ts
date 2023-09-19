import { TABLES } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { PitchCategory } from 'src/pitch-category/entities/pitch-category.entity';
import { Round } from 'src/round/entities/round.entity';
import { Team } from 'src/team/entities/team.entity';
import User from 'src/user/entities/user.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ModeEnum, TournamentTypeEnum } from '../enums/tournament.enum';

@Entity(TABLES.tournament)
export class Tournament extends Base {
  @Column({ type: 'text' })
  name: string;

  @Column({ nullable: true })
  cover: string;

  @Column({
    type: 'enum',
    enum: ModeEnum,
    default: ModeEnum.Private,
  })
  mode: ModeEnum;

  @Column({
    type: 'enum',
    enum: TournamentTypeEnum,
    default: TournamentTypeEnum.Knockout,
  })
  type: TournamentTypeEnum;

  @Column()
  totalTeam: number;

  @ManyToOne(() => PitchCategory, (pitchCategory) => pitchCategory.tournaments)
  pitchCategory: PitchCategory;

  @OneToMany(() => Team, (team) => team.tournament)
  teams: Team[];

  @OneToMany(() => Round, (round) => round.tournament)
  rounds: Round[];

  @ManyToOne(() => Venue, (venue) => venue.tournaments)
  venue: Venue;

  @ManyToOne(() => User, (user) => user.tournaments)
  user: User;
}
