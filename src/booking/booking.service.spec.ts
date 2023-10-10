import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageInfoData } from 'src/common/dtos/base.dto';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import { PitchService } from 'src/pitch/pitch.service';
import { PitchCategory } from 'src/pitch-category/entities/pitch-category.entity';
import { Raw, Repository } from 'typeorm';
import { BookingService } from './booking.service';
import { BookingAnalystQuery } from './dtos/booking-analyst-query.dto';
import { BookingQuery } from './dtos/booking-query.dto';
import { Booking } from './entities/booking.entity';

describe('BookingService', () => {
  let service: BookingService;
  let bookingRepository: Repository<Booking>;

  const mockBookingRepository = {
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockPitchService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: PitchService,
          useValue: mockPitchService,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    bookingRepository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllBooking Method', () => {
    it('should return all bookings based on query', async () => {
      const query = {
        limit: 0,
        page: 1,
      } as BookingQuery;
      const mockBookings = [
        {
          id: 1,
          startTime: new Date(),
          endTime: new Date(),
          totalPrice: 120000,
        },
        {
          id: 2,
          startTime: new Date(),
          endTime: new Date(),
          totalPrice: 130000,
        },
      ] as Booking[];
      const pageInfo: PageInfoData = {
        page: 1,
        pageCount: 1,
        pageSize: 2,
        count: 2,
      };

      const expectedResult = { data: mockBookings, pageInfo };

      mockBookingRepository.findAndCount.mockResolvedValue([mockBookings, 2]);

      const result = await service.findAllBooking(query);

      expect(result).toEqual(expectedResult);

      expect(mockBookingRepository.findAndCount).toHaveBeenCalledWith({
        take: 0,
        skip: 0,
        order: {},
        where: {
          ...(query.venueId && {
            pitch: {
              venue: {
                id: query.venueId,
              },
            },
          }),
          ...(query.pitchId && {
            pitch: {
              id: query.pitchId,
            },
          }),
          ...(query.date && {
            startTime: Raw((alias) => `DATE(${alias}) = DATE(:date)`, { date: query.date }),
          }),
        },
        relations: {
          pitch: {
            pitchCategory: true,
          },
          user: true,
        },
      });
    });
  });
  describe('analystIncome', () => {
    it('should return an array of income data', async () => {
      const year = 2023;
      const venueId = 1;

      // Mock the expected result from the query builder
      const expectedResult = [
        { day: '01/01/2023', total: 100 },
        { day: '01/02/2023', total: 150 },
      ];

      // Mock the query builder methods and their results
      jest.spyOn(mockBookingRepository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(expectedResult),
      });

      const query: BookingAnalystQuery = { year, venueId };
      const result = await service.analystIncome(query);

      expect(result).toEqual(expectedResult);
      // Ensure that the query builder methods were called correctly
      expect(bookingRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(bookingRepository.createQueryBuilder).toHaveBeenCalledWith('b');
      expect(bookingRepository.createQueryBuilder().select).toHaveBeenCalledWith(
        "TO_CHAR(DATE_TRUNC('DAY', b.createdAt), 'mm/dd/yyyy')",
        'day',
      );
      expect(bookingRepository.createQueryBuilder().addSelect).toHaveBeenCalledWith('SUM(b.totalPrice)::int', 'total');
      expect(bookingRepository.createQueryBuilder().leftJoin).toHaveBeenCalledWith(Pitch, 'p', 'b.pitchId = p.id');
      expect(bookingRepository.createQueryBuilder().where).toHaveBeenCalledWith(
        "DATE_PART('YEAR', b.createdAt) = :year",
        { year },
      );
      expect(bookingRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith('p."venueId" = :venueId', {
        venueId,
      });
      expect(bookingRepository.createQueryBuilder().groupBy).toHaveBeenCalledWith("DATE_TRUNC('DAY', b.createdAt)");
      expect(bookingRepository.createQueryBuilder().getRawMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('analystCategory', () => {
    it('should return an array of category data', async () => {
      const year = 2023;
      const venueId = 1;

      // Mock the expected result from the query builder
      const expectedResult = [
        { pitchCategoryId: 1, category: 'Category 1', total: 5 },
        { pitchCategoryId: 2, category: 'Category 2', total: 3 },
      ];

      // Mock the query builder methods and their results
      jest.spyOn(mockBookingRepository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        addGroupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(expectedResult),
      });

      const query: BookingAnalystQuery = { year, venueId };
      const result = await service.analystCategory(query);

      expect(result).toEqual(expectedResult);
      // Ensure that the query builder methods were called correctly
      expect(bookingRepository.createQueryBuilder).toHaveBeenCalledTimes(9);
      expect(bookingRepository.createQueryBuilder).toHaveBeenCalledWith('b');
      expect(bookingRepository.createQueryBuilder().select).toHaveBeenCalledWith(
        'p.pitchCategoryId',
        'pitchCategoryId',
      );
      expect(bookingRepository.createQueryBuilder().addSelect).toHaveBeenCalledWith('pc.name', 'category');
      expect(bookingRepository.createQueryBuilder().addSelect).toHaveBeenCalledWith('COUNT(*)::int', 'total');
      expect(bookingRepository.createQueryBuilder().leftJoin).toHaveBeenCalledWith(Pitch, 'p', 'b.pitchId = p.id');
      expect(bookingRepository.createQueryBuilder().leftJoin).toHaveBeenCalledWith(
        PitchCategory,
        'pc',
        'p."pitchCategoryId" = pc.id',
      );
      expect(bookingRepository.createQueryBuilder().where).toHaveBeenCalledWith(
        "DATE_PART('YEAR', b.createdAt) = :year",
        { year },
      );
      expect(bookingRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith('p."venueId" = :venueId', {
        venueId,
      });
      expect(bookingRepository.createQueryBuilder().groupBy).toHaveBeenCalledWith('pc.name');
      expect(bookingRepository.createQueryBuilder().addGroupBy).toHaveBeenCalledWith('p.pitchCategoryId');
      expect(bookingRepository.createQueryBuilder().getRawMany).toHaveBeenCalledTimes(1);
    });
  });
});
