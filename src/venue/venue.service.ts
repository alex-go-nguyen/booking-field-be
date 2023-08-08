import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEnum } from 'src/common/enums/order.enum';
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
    const { limit, page, order, maxPrice, minPrice, pitchCategory: pitchCategory } = query;
    const take = limit || 0;
    const skip = (page - 1) * take;

    const subQuery = this.venueRepository
      .createQueryBuilder('v')
      .select('v._id', '_id')
      .addSelect('p.price', 'price')
      .addSelect('p.pitchCategory_id', 'pitchCategory_id')
      .leftJoin('pitch', 'p', 'v._id = p.venue_id')
      .where('p.price > :minPrice')
      .andWhere('p.price < :maxPrice')
      .andWhere('p.pitchCategory_id = :pitchCategory_id')
      .andWhere('v._id IN (:...ids)')
      .take(take)
      .skip(skip)
      .groupBy('v._id')
      .addGroupBy('p.price')
      .addGroupBy('p.pitchCategory_id')
      .getQuery();

    const mainQuery = this.venueRepository
      .createQueryBuilder('v')
      .select('v.*')
      .addSelect('vp.*')
      .leftJoin(`(${subQuery})`, 'vp', 'v._id = vp._id')
      .setParameters({ maxPrice, minPrice, pitchCategory_id: pitchCategory, ids: venueIds })
      .where('vp._id notnull')
      .orderBy('vp.price', order || OrderEnum.Asc);

    const dataQb = mainQuery.getRawMany();
    const countQb = mainQuery.getCount();

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
