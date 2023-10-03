import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseQuery } from 'src/common/dtos/query.dto';
import { BaseService } from 'src/common/services/base.service';
import { dateToTimeFloat } from 'src/common/utils';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import { PitchService } from 'src/pitch/pitch.service';
import { PitchCategory } from 'src/pitch-category/entities/pitch-category.entity';
import { Raw, Repository } from 'typeorm';
import { BookingAnalystQuery } from './dtos/booking-analyst-query.dto';
import { BookingQuery } from './dtos/booking-query.dto';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService extends BaseService<Booking, unknown> {
  constructor(
    @InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,
    private readonly pitchService: PitchService,
  ) {
    super(bookingRepository);
  }

  findAllBooking(query: BookingQuery) {
    const { pitchId, venueId, date } = query;

    this.findAndCount(query, {
      where: {
        ...(venueId && {
          pitch: {
            venue: {
              id: venueId,
            },
          },
        }),
        ...(pitchId && {
          pitch: {
            id: pitchId,
          },
        }),
        ...(date && {
          startTime: Raw((alias) => `DATE(${alias}) = DATE(:date)`, { date }),
        }),
      },
      relations: {
        pitch: {
          pitchCategory: true,
        },
        user: true,
      },
    });
  }

  async analystIncome({ year, venueId }: BookingAnalystQuery) {
    const qb = this.bookingRepository
      .createQueryBuilder('b')
      .select("TO_CHAR(DATE_TRUNC('DAY', b.createdAt), 'mm/dd/yyyy')", 'day')
      .addSelect('SUM(b.totalPrice)::int', 'total')
      .leftJoin(Pitch, 'p', 'b.pitchId = p.id')
      .where("DATE_PART('YEAR', b.createdAt) = :year", { year })
      .andWhere('p."venueId" = :venueId', { venueId })
      .groupBy("DATE_TRUNC('DAY', b.createdAt)");

    const data = await qb.getRawMany();
    return { data };
  }

  async analystCategory({ year, venueId }: BookingAnalystQuery) {
    const qb = this.bookingRepository
      .createQueryBuilder('b')
      .select('p.pitchCategoryId', 'pitchCategoryId')
      .addSelect('pc.name', 'category')
      .addSelect('COUNT(*)::int', 'total')
      .leftJoin(Pitch, 'p', 'b.pitchId = p.id')
      .leftJoin(PitchCategory, 'pc', 'p."pitchCategoryId" = pc.id')
      .where("DATE_PART('YEAR', b.createdAt) = :year", { year })
      .andWhere('p."venueId" = :venueId', { venueId })
      .groupBy('pc.name')
      .addGroupBy('p.pitchCategoryId');

    const data = await qb.getRawMany();
    return { data };
  }

  getUserBookings(id: number, query: BaseQuery) {
    return this.findAndCount(query, {
      where: {
        user: {
          id,
        },
      },
      relations: {
        pitch: {
          pitchCategory: true,
          venue: true,
        },
        rating: true,
      },
    });
  }

  async findOneBooking(id: number) {
    const data = await this.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
        pitch: {
          pitchCategory: true,
          venue: true,
        },
        rating: true,
      },
    });

    return { data };
  }

  async createBooking(createBookingDto: CreateBookingDto, userId: number) {
    const { pitch: pitchId, startTime, endTime } = createBookingDto;

    const pitch = await this.pitchService.findOne({
      where: {
        id: pitchId,
      },
    });

    const start = dateToTimeFloat(new Date(startTime));
    const end = dateToTimeFloat(new Date(endTime)) === 0 ? 24 : dateToTimeFloat(new Date(endTime));

    const totalPrice = pitch.price * (end - start);

    const payload = { ...createBookingDto, user: userId, totalPrice };

    const data = await this.create(payload);

    return { data };
  }

  async updateBooking(id: number, updateBookingDto: UpdateBookingDto) {
    const data = await this.update(id, updateBookingDto);

    return { data };
  }
}
