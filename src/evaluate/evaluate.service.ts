import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { Evaluate } from './entities/evaluate.entity';

@Injectable()
export class EvaluateService extends BaseService<Evaluate, unknown> {
  constructor(@InjectRepository(Evaluate) private readonly evaluateRepository: Repository<Evaluate>) {
    super(evaluateRepository);
  }
}
