import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import { OrderEnum } from 'src/common/enums/order.enum';
import { BaseService } from 'src/common/services/base.service';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { SearchService } from 'src/search/search.service';
import { UserService } from 'src/user/users.service';
import { Repository } from 'typeorm';
import { CreateVenueDto } from './dtos/create-venue.dto';
import { VenueQuery } from './dtos/query-venue.dto';
import { SearchListVenueQuery } from './dtos/search-list-venue.dto';
import { Venue } from './entities/venue.entity';
import { VenueStatusEnum } from './enums/venue.enum';
import { VenueSearchBody } from './interfaces/venue-search.interface';

@Injectable()
export class VenueService extends BaseService<Venue, unknown> {
  constructor(
    @InjectRepository(Venue) private venueRepository: Repository<Venue>,
    @InjectRepository(Rating) private ratingRepository: Repository<Rating>,
    @InjectRepository(Pitch) private pitchRepository: Repository<Pitch>,
  ) {
    super(venueRepository);
  }

  async findAllVenues(query: VenueQuery) {
    const { userId, status, keyword, isProminant, page, limit } = query;

    const take = limit || 0;
    const skip = (page - 1) * take;

    const qb = this.venueRepository
      .createQueryBuilder('v')
      .leftJoinAndSelect('v.pitches', 'pitches')
      .leftJoinAndSelect('pitches.pitchCategory', 'pitchCategory')
      .leftJoinAndSelect('v.user', 'user')
      .where('v.status = :status', { status: status || VenueStatusEnum.Active });

    if (userId) {
      qb.andWhere('user.id = :userId', { userId });
    }

    if (keyword) {
      qb.andWhere('v.name ILike :keyword', { keyword });
    }

    if (isProminant) {
      const subQb = this.venueRepository
        .createQueryBuilder('v')
        .select('v.id', 'id')
        .addSelect('COUNT(b.id)::int', 'totalBooking')
        .leftJoin(Pitch, 'p', 'v.id = p."venueId"')
        .leftJoin(Booking, 'b', 'p.id = b."pitchId"')
        .groupBy('p."venueId"')
        .addGroupBy('v.id')
        .getQuery();

      qb.leftJoin(`(${subQb})`, 'rs', 'rs.id = v.id').orderBy('rs."totalBooking"', OrderEnum.Desc);
    }

    qb.offset(skip).limit(take);

    const [data, count] = await qb.getManyAndCount();

    const pageCount = take === 0 ? 1 : Math.ceil(count / take);
    const pageSize = take === 0 ? count : take;

    return {
      data,
      pageInfo: {
        page,
        pageSize,
        pageCount,
        count,
      },
    };
  }

  async searchVenues(query: SearchListVenueQuery) {
    const { limit, page, sorts, maxPrice, minPrice, pitchCategory: pitchCategory, location } = query;

    const ids = await this.searchService.search<VenueSearchBody>('venues', location, [
      'name',
      'description',
      'district',
      'province',
    ]);

    if (ids.length === 0) {
      return { data: null };
    }

    const take = limit || 0;
    const skip = (page - 1) * take;

    const subQb = this.venueRepository
      .createQueryBuilder('v')
      .select('v.id', 'id')
      .addSelect('p.price', 'price')
      .leftJoin(Pitch, 'p', 'v.id = p.venueId')
      .leftJoin(Booking, 'b', 'p.id = b.pitchId')
      .leftJoin(Rating, 'r', 'r.bookingId = b.id')
      .where('p.price > :minPrice')
      .andWhere('p.price < :maxPrice')
      .andWhere('p.pitchCategoryId = :pitchCategoryId')
      .andWhere('v.id IN (:...ids)')
      .andWhere('v.status = :status', { status: VenueStatusEnum.Active })
      .groupBy('v.id')
      .addGroupBy('p.price')
      .addGroupBy('p.pitchCategoryId')
      .getQuery();

    const subQb2 = this.ratingRepository
      .createQueryBuilder('r')
      .select('*')
      .leftJoin(Booking, 'b', 'b.id = r.bookingId')
      .getQuery();

    const mainQb2 = this.pitchRepository
      .createQueryBuilder('p')
      .select('p."venueId"', 'venueId')
      .addSelect('AVG(rb."serviceRate")::int', 'averageServiceRate')
      .addSelect('AVG(rb."qualityRate")::int', 'averageQualityRate')
      .addSelect('COUNT(rb."qualityRate")::int', 'totalReview')
      .leftJoin(`(${subQb2})`, 'rb', 'rb."pitchId" = p.id')
      .groupBy('p."venueId"')
      .getQuery();

    const mainQb = this.venueRepository
      .createQueryBuilder('v')
      .select('v.*')
      .addSelect('vp.*')
      .addSelect('pr.*')
      .leftJoin(`(${subQb})`, 'vp', 'v.id = vp.id')
      .leftJoin(`(${mainQb2})`, 'pr', 'pr."venueId" = v.id')
      .setParameters({ maxPrice, minPrice, pitchCategoryId: pitchCategory, ids: venueIds })
      .where('vp.id notnull');

    if (sorts) {
      sorts?.map((sort) => {
        const { field, order } = sort;
        mainQb.addOrderBy(`vp.${field}`, order);
      });
    }
    mainQb.take(take).skip(skip);

    const dataQb = mainQb.getRawMany();
    const countQb = mainQb.getCount();

    const [data, count] = await Promise.all([dataQb, countQb]);

    const pageCount = take === 0 ? 1 : Math.ceil(count / take);
    const pageSize = take === 0 ? count : take;

    return {
      data,
      pageInfo: {
        page,
        pageSize,
        pageCount,
        count,
      },
    };
  }
}
