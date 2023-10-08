import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import { RoleEnum } from 'src/common/enums/role.enum';
import { BaseService } from 'src/common/services/base.service';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { SearchService } from 'src/search/search.service';
import { UserService } from 'src/user/users.service';
import { ILike, Repository } from 'typeorm';
import { CreateVenueDto } from './dtos/create-venue.dto';
import { VenueQuery } from './dtos/query-venue.dto';
import { SearchVenuesQuery } from './dtos/search-list-venue.dto';
import { UpdateVenueDto } from './dtos/update-venue.dto';
import { Venue } from './entities/venue.entity';
import { VenueStatusEnum } from './enums/venue.enum';
import { VenueSearchBody } from './interfaces/venue-search.interface';

@Injectable()
export class VenueService extends BaseService<Venue, unknown> {
  constructor(
    @InjectRepository(Venue) private venueRepository: Repository<Venue>,
    @InjectRepository(Rating) private ratingRepository: Repository<Rating>,
    @InjectRepository(Pitch) private pitchRepository: Repository<Pitch>,
    private readonly searchService: SearchService,
    private readonly userService: UserService,
  ) {
    super(venueRepository);
  }

  findAllVenues(query: VenueQuery) {
    const { userId, status, keyword } = query;

    return this.findAndCount(query, {
      where: {
        ...(userId && {
          user: {
            id: userId,
          },
        }),
        ...(keyword && {
          name: ILike(`%${keyword}%`),
        }),
        status: status || VenueStatusEnum.Active,
      },
      relations: {
        pitches: {
          pitchCategory: true,
        },
        user: true,
      },
    });
  }

  async searchVenues(query: SearchVenuesQuery) {
    const {
      limit,
      page,
      sorts,
      maxPrice,
      minPrice,
      pitchCategory: pitchCategory,
      location,
      currentLat,
      currentLng,
      maxDistance,
      isProminant,
    } = query;

    const ids = location
      ? await this.searchService.search<VenueSearchBody>('venues', location, [
          'name',
          'description',
          'district',
          'province',
        ])
      : [];

    const take = limit || 0;
    const skip = (page - 1) * take;

    const subQb = this.venueRepository
      .createQueryBuilder('v')
      .select('v.id', 'id')
      .addSelect('MIN(p.price)', 'price')
      .leftJoin(Pitch, 'p', 'v.id = p.venueId')
      .leftJoin(Booking, 'b', 'p.id = b.pitchId')
      .leftJoin(Rating, 'r', 'r.bookingId = b.id')
      .where('v.status = :status')
      .groupBy('v.id');

    minPrice && subQb.andWhere('p.price > :minPrice');
    maxPrice && subQb.andWhere('p.price < :maxPrice');
    pitchCategory && subQb.andWhere('p.pitchCategoryId = :pitchCategoryId');

    if (location) {
      if (ids.length === 0) {
        return [];
      }

      subQb.andWhere('v.id IN (:...ids)');
    }

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

      .leftJoin(`(${subQb.getQuery()})`, 'vp', 'v.id = vp.id')
      .leftJoin(`(${mainQb2})`, 'pr', 'pr."venueId" = v.id')
      .setParameters({ maxPrice, minPrice, pitchCategoryId: pitchCategory, ids, status: VenueStatusEnum.Active })
      .where('vp.id notnull');

    if (currentLat && currentLng) {
      mainQb
        .addSelect(
          `( 6371 * acos( cos( radians(${currentLat}) ) * cos( radians( CAST(v.location->>'lat' AS double precision)) ) * cos( radians( CAST(v.location->>'lng' AS double precision)) - radians(${currentLng}) ) + sin( radians(${currentLat}) ) * sin( radians( CAST(v.location->>'lat' AS double precision) ) ) ) )`,
          'distance',
        )
        .andWhere(
          `( 6371 * acos( cos( radians(${currentLat}) ) * cos( radians( CAST(v.location->>'lat' AS double precision)) ) * cos( radians( CAST(v.location->>'lng' AS double precision)) - radians(${currentLng}) ) + sin( radians(${currentLat}) ) * sin( radians( CAST(v.location->>'lat' AS double precision) ) ) ) ) < :maxDistance`,
          { maxDistance },
        )
        .addOrderBy('distance', 'ASC');
    }

    if (isProminant) {
      mainQb
        .leftJoinAndSelect(
          (subQb) => {
            return subQb
              .select('COUNT(b.id)', 'totalBooking')
              .addSelect('v.id', 'id')
              .from(Venue, 'v')
              .leftJoin(Pitch, 'p', 'p."venueId" = v.id')
              .leftJoin(Booking, 'b', 'b."pitchId" = p.id')
              .groupBy('p."venueId"')
              .addGroupBy('v.id');
          },
          'rs',
          'rs.id = v.id',
        )
        .orderBy('rs."totalBooking"', 'DESC');
    }

    if (sorts) {
      sorts?.map((sort) => {
        const { field, order } = sort;
        mainQb.addOrderBy(`vp.${field}`, order);
      });
    }

    mainQb.limit(take).offset(skip);

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

  getVenueByCurrentUser(userId: number) {
    return this.findOne({
      where: {
        user: {
          id: userId,
        },
        status: VenueStatusEnum.Active,
      },
      relations: {
        pitches: {
          pitchCategory: true,
        },
      },
    });
  }

  findBySlug(slug: string) {
    return this.findOne({
      where: {
        slug,
        status: VenueStatusEnum.Active,
      },
      relations: {
        pitches: {
          pitchCategory: true,
        },
      },
    });
  }

  async createVenue(createVenueDto: CreateVenueDto, role: RoleEnum) {
    const status = role === RoleEnum.Admin ? VenueStatusEnum.Active : VenueStatusEnum.Waiting;

    const data = await this.create({ ...createVenueDto, status });

    if (role === RoleEnum.Admin) {
      const { id, name, description, district, province } = data;
      this.searchService.index<VenueSearchBody>('venues', {
        id,
        name,
        description,
        province,
        district,
      });

      this.userService.update(createVenueDto.user, { role: RoleEnum.Owner });
    }

    return data;
  }

  async updateVenue(id: number, updateVenueDto: UpdateVenueDto) {
    await this.update(id, updateVenueDto);

    const data = await this.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });

    if (data.status === VenueStatusEnum.Active) {
      const { id, name, description, district, province } = data;
      this.searchService.index<VenueSearchBody>('venues', {
        id,
        name,
        description,
        province,
        district,
      });
      this.userService.update(data.user.id, { role: RoleEnum.Owner });
    }
    if (data.status === VenueStatusEnum.Cancel) {
      this.userService.update(data.user.id, { role: RoleEnum.User });
    }

    return data;
  }
}
