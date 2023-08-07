import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { PitchCategory } from './entities/pitch-category.entity';

@Injectable()
export class PitchCategoryService extends BaseService<PitchCategory, unknown> {
  constructor(@InjectRepository(PitchCategory) private readonly pitchCategoryService: Repository<PitchCategory>) {
    super(pitchCategoryService);
  }
}
