import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rating])],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}
