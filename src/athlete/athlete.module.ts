import { Module } from '@nestjs/common';
import { AthleteController } from './athlete.controller';
import { AthleteService } from './athlete.service';

@Module({
  providers: [AthleteService],
  controllers: [AthleteController],
})
export class AthleteModule {}
