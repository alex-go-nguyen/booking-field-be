import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { PitchCategory } from 'src/pitch-category/entities/pitch-category.entity';
import { Repository } from 'typeorm';
import { FindPitchQueryDto } from './dtos/find-pitch.dto';
import { Pitch } from './entities/pitch.entity';

@Injectable()
export class PitchService extends BaseService<Pitch, unknown> {
  constructor(@InjectRepository(Pitch) private pitchRepository: Repository<Pitch>) {
    super(pitchRepository);
  }

  findInVenueDetail(venueId: number) {
    return this.pitchRepository
      .createQueryBuilder('p')
      .select('p.pitchCategory_id')
      .addSelect('p.price', 'price')
      .addSelect('c.*')
      .addSelect('count(p.pitchCategory_id)::int', 'quantity')
      .leftJoin(PitchCategory, 'c', 'p.pitchCategory_id = c._id')
      .where('p.venue_id = :venueId', { venueId })
      .groupBy('p.pitchCategory_id')
      .addGroupBy('p.price')
      .addGroupBy('c._id')
      .getRawMany();
  }

  async findByVenue(venueId: number, query: FindPitchQueryDto) {
    const { pitchCategoryId } = query;

    const qb = this.pitchRepository.createQueryBuilder('p').select('*').where('p.venue_id = :venueId', { venueId });
    if (pitchCategoryId) {
      qb.andWhere('p.pitchCategory_id = :pitchCategoryId', { pitchCategoryId });
    }
    return qb.getRawMany();
  }
}
