import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';

const mockBooking = () => {
  return {
    id: 1,
    startTime: '2023-09-21T10:11:52.481Z',
    endTime: '2023-09-21T10:11:52.481Z',
    totalPrice: 120000,
  };
};

const mockBookings = () => {
  return [
    {
      id: 1,
      startTime: '2023-09-21T10:11:52.481Z',
      endTime: '2023-09-21T10:11:52.481Z',
      totalPrice: 120000,
    },
    {
      id: 2,
      startTime: '2023-09-21T10:11:52.481Z',
      endTime: '2023-09-21T10:11:52.481Z',
      totalPrice: 240000,
    },
  ];
};

const bookingServiceMock: Partial<BookingService> = {
  findOne: jest.fn().mockResolvedValue(mockBooking()),
  findAll: jest.fn().mockResolvedValue(mockBookings()),
  create: jest.fn().mockResolvedValue(mockBooking()),
};

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingService, { provide: BookingService, useValue: bookingServiceMock }],
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBooking', () => {
    it('should return booking', async () => {
      const result = {
        id: 1,
        startTime: '2023-09-21T10:11:52.481Z',
        endTime: '2023-09-21T10:11:52.481Z',
        totalPrice: 120000,
      };

      bookingServiceMock.findOne = jest.fn().mockResolvedValue(result);

      await expect(
        service.findOne({
          where: {
            id: 1,
          },
        }),
      ).resolves.toEqual(result);
    });
  });

  describe('getAllBooking', () => {
    it('should return array of booking', async () => {
      const results = [
        {
          id: 1,
          startTime: '2023-09-21T10:11:52.481Z',
          endTime: '2023-09-21T10:11:52.481Z',
          totalPrice: 120000,
        },
        {
          id: 2,
          startTime: '2023-09-21T10:11:52.481Z',
          endTime: '2023-09-21T10:11:52.481Z',
          totalPrice: 240000,
        },
      ];

      await expect(service.findAll()).resolves.toEqual(results);
    });
  });

  describe('createBooking', () => {
    it('should return booking', async () => {
      const result = {
        id: 1,
        startTime: '2023-09-21T10:11:52.481Z',
        endTime: '2023-09-21T10:11:52.481Z',
        totalPrice: 120000,
      };

      await expect(service.create(result)).resolves.toEqual(result);
    });
  });
});
