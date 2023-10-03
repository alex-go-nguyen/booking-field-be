import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetRatingQuery } from './dtos/rating-query.dto';
import { Rating } from './entities/rating.entity';
import { RatingService } from './rating.service';

describe('RatingService', () => {
  let service: RatingService;
  let ratingRepository: Repository<Rating>;

  const mockRatingRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        {
          provide: getRepositoryToken(Rating),
          useValue: mockRatingRepository,
        },
      ],
    }).compile();

    service = module.get<RatingService>(RatingService);
    ratingRepository = module.get<Repository<Rating>>(getRepositoryToken(Rating));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllRating', () => {
    it('should find and count ratings with given query', async () => {
      const query: GetRatingQuery = {
        page: 1,
        limit: 0,
        venueId: 1,
      };

      const ratings = [{ id: 1 }, { id: 2 }];
      const totalCount = 2;

      mockRatingRepository.findAndCount.mockResolvedValue([ratings, totalCount]);

      const result = await service.findAllRating(query);

      expect(mockRatingRepository.findAndCount).toHaveBeenCalledWith({
        take: 0,
        skip: 0,
        order: {},
        where: {
          booking: {
            pitch: {
              venue: {
                id: 1,
              },
            },
          },
        },
        relations: {
          booking: {
            pitch: {
              pitchCategory: true,
              venue: true,
            },
            user: true,
          },
        },
      });
      expect(result).toEqual({
        data: ratings,
        pageInfo: {
          count: 2,
          page: 1,
          pageCount: 1,
          pageSize: 2,
        },
      });
    });

    // it('should find and count all ratings when no query provided', async () => {
    //   const query = {} as GetRatingsQuery;

    //   const ratings = [{ id: 1 }, { id: 2 }];
    //   const totalCount = 2;

    //   mockRatingRepository.findAndCount.mockResolvedValue([ratings, totalCount]);

    //   const result = await service.findAllRating(query);

    //   expect(mockRatingRepository.findAndCount).toHaveBeenCalledWith({ take: 0, skip: 0, order: {}, where: {} });
    //   expect(result).toEqual({
    //     data: ratings,
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

      mockRatingRepository.findOne.mockResolvedValue(round);

      const result = await service.findById(roundId);

      expect(mockRatingRepository.findOne).toHaveBeenCalledWith({ where: { id: roundId } });
      expect(result).toEqual(round);
    });

    it('should return null when no round found with the given ID', async () => {
      const roundId = 1;

      mockRatingRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(roundId);

      expect(mockRatingRepository.findOne).toHaveBeenCalledWith({ where: { id: roundId } });
      expect(result).toBeNull();
    });
  });
});
