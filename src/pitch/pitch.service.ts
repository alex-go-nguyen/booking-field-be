import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { SearchService } from 'src/search/search.service';
import { VenueSearchBody } from 'src/venue/interfaces/venue-search.interface';
import { Between, In, Repository } from 'typeorm';
import { PitchQuery } from './dtos/pitch-query.dto';
import { Pitch } from './entities/pitch.entity';

@Injectable()
export class PitchService extends BaseService<Pitch, unknown> {
  constructor(
    @InjectRepository(Pitch) private pitchRepository: Repository<Pitch>,
    private readonly searchService: SearchService,
  ) {
    super(pitchRepository);
  }

  async findAllPitches(query: PitchQuery) {
    const { page, limit, pitchCategoryId, venueId, minPrice, maxPrice, location, sorts } = query;

    let ids: number[] = [];
    if (location) {
      ids = await this.searchService.search<VenueSearchBody>('venues', location, [
        'name',
        'description',
        'district',
        'province',
      ]);
    }

    return this.findAndCount(
      { page, limit, sorts },
      {
        where: {
          ...(minPrice &&
            maxPrice && {
              price: Between(minPrice, maxPrice),
            }),
          ...(pitchCategoryId && {
            pitchCategory: {
              id: pitchCategoryId,
            },
          }),
          ...(location && {
            venue: {
              id: In(ids),
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
