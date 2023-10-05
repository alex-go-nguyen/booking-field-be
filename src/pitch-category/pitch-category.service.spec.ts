import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetPitchCategoriesQuery } from './dtos/pitch-category-query.dto';
import { PitchCategory } from './entities/pitch-category.entity';
import { PitchCategoryService } from './pitch-category.service';

describe('PitchCategoryService', () => {
  let service: PitchCategoryService;
  let ratingRepository: Repository<PitchCategory>;

  const mockPitchCategoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PitchCategoryService,
        {
          provide: getRepositoryToken(PitchCategory),
          useValue: mockPitchCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<PitchCategoryService>(PitchCategoryService);
    ratingRepository = module.get<Repository<PitchCategory>>(getRepositoryToken(PitchCategory));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllPitchCategory', () => {
    it('should find and count pitchCategories with given query', async () => {
      const query: GetPitchCategoriesQuery = {
        page: 1,
        limit: 0,
        venueId: 1,
      };

      const pitchCategories = [{ id: 1 }, { id: 2 }];
      const totalCount = 2;

      mockPitchCategoryRepository.findAndCount.mockResolvedValue([pitchCategories, totalCount]);

      const result = await service.findAllPitchCategories(query);

      expect(mockPitchCategoryRepository.findAndCount).toHaveBeenCalledWith({
        take: 0,
        skip: 0,
        order: {},
        where: {
          pitches: {
            venue: {
              id: 1,
            },
          },
        },
      });
      expect(result).toEqual({
        data: pitchCategories,
        pageInfo: {
          count: 2,
          page: 1,
          pageCount: 1,
          pageSize: 2,
        },
      });
    });

    // it('should find and count all pitchCategories when no query provided', async () => {
    //   const query = {} as GetPitchCategorysQuery;

    //   const pitchCategories = [{ id: 1 }, { id: 2 }];
    //   const totalCount = 2;

    //   mockPitchCategoryRepository.findAndCount.mockResolvedValue([pitchCategories, totalCount]);

    //   const result = await service.findAllPitchCategory(query);

    //   expect(mockPitchCategoryRepository.findAndCount).toHaveBeenCalledWith({ take: 0, skip: 0, order: {}, where: {} });
    //   expect(result).toEqual({
    //     data: pitchCategories,
    //     pageInfo: {
    //       count: 2,
    //       page: undefined,
    //       pageCount: 1,
    //       pageSize: 2,
    //     },
    //   });
    // });
  });

  describe('findById', () => {
    it('should find a round by ID', async () => {
      const roundId = 1;
      const round = { id: roundId };

      mockPitchCategoryRepository.findOne.mockResolvedValue(round);

      const result = await service.findById(roundId);

      expect(mockPitchCategoryRepository.findOne).toHaveBeenCalledWith({ where: { id: roundId } });
      expect(result).toEqual(round);
    });

    it('should return null when no round found with the given ID', async () => {
      const roundId = 1;

      mockPitchCategoryRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(roundId);

      expect(mockPitchCategoryRepository.findOne).toHaveBeenCalledWith({ where: { id: roundId } });
      expect(result).toBeNull();
    });
  });
});
