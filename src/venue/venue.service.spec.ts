import { Test, TestingModule } from '@nestjs/testing';
import { VenueService } from './venue.service';

const mockVenue = () => {
  return {
    id: 1,
    name: 'san bong lu doan',
    address: '28/2 duong so 3',
    openAt: '08:00',
    closeAt: '23:00',
    district: 'Quan 2',
    province: 'Ho Chi Minh',
  };
};

const mockVenues = () => {
  return [
    {
      id: 1,
      name: 'san bong lu doan',
      address: '28/2 duong so 3',
      openAt: '08:00',
      closeAt: '23:00',
      district: 'Quan 2',
      province: 'Ho Chi Minh',
    },
    {
      id: 2,
      name: 'san bong hai quan',
      address: '28/2 duong so 4',
      openAt: '08:00',
      closeAt: '23:00',
      district: 'Quan 2',
      province: 'Ho Chi Minh',
    },
  ];
};

const venueServiceMock: Partial<VenueService> = {
  findOne: jest.fn().mockResolvedValue(mockVenue()),
  findAll: jest.fn().mockResolvedValue(mockVenues()),
};

describe('VenueService', () => {
  let service: VenueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VenueService, { provide: VenueService, useValue: venueServiceMock }],
    }).compile();

    service = module.get<VenueService>(VenueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRating', () => {
    it('should return rating', async () => {
      const result = {
        id: 1,
        name: 'san bong lu doan',
        address: '28/2 duong so 3',
        openAt: '08:00',
        closeAt: '23:00',
        district: 'Quan 2',
        province: 'Ho Chi Minh',
      };

      venueServiceMock.findOne = jest.fn().mockResolvedValue(result);

      await expect(
        service.findOne({
          where: {
            id: 1,
          },
        }),
      ).resolves.toEqual(result);
    });
  });

  describe('getAllPitch', () => {
    it('should return array of pitch', async () => {
      const results = [
        {
          id: 1,
          name: 'san bong lu doan',
          address: '28/2 duong so 3',
          openAt: '08:00',
          closeAt: '23:00',
          district: 'Quan 2',
          province: 'Ho Chi Minh',
        },
        {
          id: 2,
          name: 'san bong hai quan',
          address: '28/2 duong so 4',
          openAt: '08:00',
          closeAt: '23:00',
          district: 'Quan 2',
          province: 'Ho Chi Minh',
        },
      ];

      venueServiceMock.findAll = jest.fn().mockResolvedValue(results);

      await expect(service.findAll()).resolves.toEqual(results);
    });
  });
});
