import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { GetPitchCategoriesQuery } from './dtos/pitch-category-query.dto';
import { PitchCategory } from './entities/pitch-category.entity';

@Injectable()
export class PitchCategoryService extends BaseService<PitchCategory, unknown> {
  constructor(@InjectRepository(PitchCategory) private readonly pitchCategoryService: Repository<PitchCategory>) {
    super(pitchCategoryService);
  }

  findAllPitchCategories(query: GetPitchCategoriesQuery) {
    const { venueId } = query;

    return this.findAndCount(query, {
      where: {
        ...(venueId && {
          pitches: {
            venue: {
              id: venueId,
            },
          },
        }),
      },
    });
  }

  findById(id: number) {
    return this.findOne({
      where: {
        id,
      },
    });
  }
}
