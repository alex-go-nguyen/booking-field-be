import { TABLES } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { ModeEnum } from 'src/common/enums/mode.enum';
import { TournamentTypeEnum } from 'src/common/enums/tournament.enum';
import { Match } from 'src/match/entities/match.entity';
import { Team } from 'src/team/entities/team.entity';
import User from 'src/user/entities/user.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity(TABLES.tournament)
export class Tournament extends Base {
  @Column({ type: 'text' })
  name: string;

  @Column()
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

  @Column({
    type: Number,
    name: 'total_teams',
  })
  totalTeams: number;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  teams: Team[];

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  matches: Match[];

  @ManyToOne(() => Venue, (venue) => venue._id)
  @JoinColumn()
  venue: Venue;

  @ManyToOne(() => User, (user) => user._id)
  user: User;
}
