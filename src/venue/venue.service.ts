import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { CreateVenueDto } from './dtos/create-venue.dto';
import { ISearchListVenueQuery } from './dtos/search-list-venue.dto';
import { Venue } from './entities/venue.entity';

@Injectable()
export class VenueService extends BaseService<Venue, CreateVenueDto> {
  constructor(@InjectRepository(Venue) private venueRepository: Repository<Venue>) {
    super(venueRepository);
  }

  async searchListVenues(query?: ISearchListVenueQuery, venueIds?: Array<number>) {
    const { limit, page, sorts, maxPrice, minPrice, pitchCategory: pitchCategory } = query;
    const take = limit || 0;
    const skip = (page - 1) * take;

    const subQb = this.venueRepository
      .createQueryBuilder('v')
      .select('v._id', '_id')
      .leftJoin('pitch', 'p', 'v._id = p.venue_id')
      .where('p.price > :minPrice')
      .andWhere('p.price < :maxPrice')
      .andWhere('p.pitchCategory_id = :pitchCategory_id')
      .andWhere('v._id IN (:...ids)')
      .groupBy('v._id')
      .addGroupBy('p.price')
      .addGroupBy('p.pitchCategory_id')
      .getQuery();

    const mainQb = this.venueRepository
      .createQueryBuilder('v')
      .select('v.*')
      .addSelect('vp.*')
      .leftJoin(`(${subQb})`, 'vp', 'v._id = vp._id')
      .setParameters({ maxPrice, minPrice, pitchCategory_id: pitchCategory, ids: venueIds })
      .where('vp._id notnull');
    if (sorts) {
      sorts.map((sort) => {
        const field = Object.keys(sort);
        const order = sort[`${field}`];

        console.log(field, order);
        mainQb.addOrderBy(`b.${field[0]}`, order);
      });
    }
    mainQb.take(take).skip(skip);

    const dataQb = mainQb.getRawMany();
    const countQb = mainQb.getCount();

    const [data, total] = await Promise.all([dataQb, countQb]);

    const pageCount = take === 0 ? 1 : Math.ceil(total / take);
    const pageSize = take === 0 ? total : take;

    return {
      data,
      pageInfo: {
        page,
        pageSize,
        pageCount,
        count: total,
      },
    };
  }
}
