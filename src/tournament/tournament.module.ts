import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchModule } from 'src/match/match.module';
import { RoundModule } from 'src/round/round.module';
import { TeamModule } from 'src/team/team.module';
import { Tournament } from './entities/tournament.entity';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament]), RoundModule, MatchModule, TeamModule],
  controllers: [TournamentController],
  providers: [TournamentService],
})
export class TournamentModule {}
