import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluate } from './entities/evaluate.entity';
import { EvaluateController } from './evaluate.controller';
import { EvaluateService } from './evaluate.service';

@Module({
  imports: [TypeOrmModule.forFeature([Evaluate])],
  providers: [EvaluateService],
  controllers: [EvaluateController],
})
export class EvaluateModule {}
