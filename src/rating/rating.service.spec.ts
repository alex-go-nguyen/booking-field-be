import { Test, TestingModule } from '@nestjs/testing';
import { RatingService } from './rating.service';

const mockPitch = () => {
  return {
    id: 1,
    content: 'content',
    rate: 4,
  };
};

const mockPitches = () => {
  return [
    {
      id: 1,
      content: 'content',
      rate: 4,
    },
    {
      id: 2,
      content: 'content',
      rate: 4,
    },
    {
      id: 3,
      content: 'content',
      rate: 4,
    },
    {
      id: 4,
      content: 'content',
      rate: 4,
    },
  ];
};

const ratingServiceMock: Partial<RatingService> = {
  findOne: jest.fn().mockResolvedValue(mockPitch()),
  findAll: jest.fn().mockResolvedValue(mockPitches()),
};

describe('RatingService', () => {
  let service: RatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RatingService, { provide: RatingService, useValue: ratingServiceMock }],
    }).compile();

    service = module.get<RatingService>(RatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRating', () => {
    it('should return rating', async () => {
      const result = {
        id: 1,
        content: 'content',
        rate: 4,
      };

      ratingServiceMock.findOne = jest.fn().mockResolvedValue(result);

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
          content: 'content',
          rate: 4,
        },
        {
          id: 2,
          content: 'content',
          rate: 4,
        },
        {
          id: 3,
          content: 'content',
          rate: 4,
        },
        {
          id: 4,
          content: 'content',
          rate: 4,
        },
      ];

      ratingServiceMock.findAll = jest.fn().mockResolvedValue(results);

      await expect(service.findAll()).resolves.toEqual(results);
    });
  });
});
