import { Test, TestingModule } from '@nestjs/testing';
import { PitchCategoryService } from './pitch-category.service';

const mockPitchCategory = () => {
  return {
    id: 1,
    name: 'Sân 5',
    description: 'lorem ipsum',
    thumbnail: 'avatar',
  };
};

const mockPitchCategories = () => {
  return [
    {
      id: 1,
      name: 'Sân 5',
      description: 'lorem ipsum',
      thumbnail: 'avatar',
    },
    {
      id: 2,
      name: 'Sân 7',
      description: 'lorem ipsum',
      thumbnail: 'avatar',
    },
    {
      id: 3,
      name: 'Sân 11',
      description: 'lorem ipsum',
      thumbnail: 'avatar',
    },
    {
      id: 4,
      name: 'Sân Futsal',
      description: 'lorem ipsum',
      thumbnail: 'avatar',
    },
  ];
};

const pitchCategoryServiceMock: Partial<PitchCategoryService> = {
  findOne: jest.fn().mockResolvedValue(mockPitchCategory()),
  findAll: jest.fn().mockResolvedValue(mockPitchCategories()),
};

describe('PitchCategoryService', () => {
  let service: PitchCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PitchCategoryService, { provide: PitchCategoryService, useValue: pitchCategoryServiceMock }],
    }).compile();

    service = module.get<PitchCategoryService>(PitchCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPitch', () => {
    it('should return pitch category', async () => {
      const result = {
        id: 1,
        name: 'Sân 5',
        description: 'lorem ipsum',
        thumbnail: 'avatar',
      };

      pitchCategoryServiceMock.findOne = jest.fn().mockResolvedValue(result);

      await expect(
        service.findOne({
          where: {
            id: 1,
          },
        }),
      ).resolves.toEqual(result);
    });
  });

  describe('getAllPitchCategory', () => {
    it('should return array of pitch category', async () => {
      const results = [
        {
          id: 1,
          name: 'Sân 5',
          description: 'lorem ipsum',
          thumbnail: 'avatar',
        },
        {
          id: 2,
          name: 'Sân 7',
          description: 'lorem ipsum',
          thumbnail: 'avatar',
        },
        {
          id: 3,
          name: 'Sân 11',
          description: 'lorem ipsum',
          thumbnail: 'avatar',
        },
        {
          id: 4,
          name: 'Sân Futsal',
          description: 'lorem ipsum',
          thumbnail: 'avatar',
        },
      ];

      pitchCategoryServiceMock.findAll = jest.fn().mockResolvedValue(results);

      await expect(service.findAll()).resolves.toEqual(results);
    });
  });
});
