import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageInfoData } from 'src/common/dtos/base.dto';
import { PitchService } from 'src/pitch/pitch.service';
import { Raw, Repository } from 'typeorm';
import { BookingService } from './booking.service';
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
});
