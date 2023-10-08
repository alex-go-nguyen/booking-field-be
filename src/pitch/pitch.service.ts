import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { GetPitchesQuery } from './dtos/pitch-query.dto';
import { Pitch } from './entities/pitch.entity';

@Injectable()
export class PitchService extends BaseService<Pitch, unknown> {
  constructor(@InjectRepository(Pitch) private pitchRepository: Repository<Pitch>) {
    super(pitchRepository);
  }

  async findAllPitches(query: GetPitchesQuery) {
    const { page, limit, pitchCategoryId, venueId, sorts } = query;

    return this.findAndCount(
      { page, limit, sorts },
      {
        where: {
          ...(pitchCategoryId && {
            pitchCategory: {
              id: pitchCategoryId,
            },
          }),
          ...(venueId && {
            venue: {
              id: venueId,
            },
          }),
        },
        relations: {
          pitchCategory: true,
          venue: true,
        },
      },
    );
  }

  findById(id: number) {
    return this.findOne({
      where: {
        id,
      },
    });
  }
}
