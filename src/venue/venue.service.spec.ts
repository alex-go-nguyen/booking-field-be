import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageInfoData } from 'src/common/dtos/base.dto';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { RatingService } from 'src/rating/rating.service';
import { SearchService } from 'src/search/search.service';
import { UserService } from 'src/user/users.service';
import { ILike, Repository } from 'typeorm';
import { VenueQuery } from './dtos/query-venue.dto';
import { Venue } from './entities/venue.entity';
import { VenueStatusEnum } from './enums/venue.enum';
import { VenueService } from './venue.service';

describe('VenueService', () => {
  let venueService: VenueService;
  let venueRepository: Repository<Venue>;

  const mockIndex = jest.fn();
  const mockSearch = jest.fn();

  const mockVenueRepository = {
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    getCount: jest.fn(),
  };

  const mockRatingRepository = {
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    getCount: jest.fn(),
  };

  const mockPitchRepository = {
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    getCount: jest.fn(),
  };

  const mockRatingService = {};

  const mockUserService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VenueService,
        SearchService,
        UserService,
        {
          provide: getRepositoryToken(Venue),
          useValue: mockVenueRepository,
        },
        {
          provide: getRepositoryToken(Rating),
          useValue: mockRatingRepository,
        },
        {
          provide: getRepositoryToken(Pitch),
          useValue: mockPitchRepository,
        },

        {
          provide: RatingService,
          useValue: mockRatingService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ElasticsearchService,
          useValue: {
            index: mockIndex,
            search: mockSearch,
          },
        },
      ],
    }).compile();

    venueService = module.get<VenueService>(VenueService);
    venueRepository = module.get<Repository<Venue>>(getRepositoryToken(Venue));
  });

  it('should be defined', () => {
    expect(venueService).toBeDefined();
  });

  describe('findAllVenues Method', () => {
    it('should return venues based on query parameters', async () => {
      const query = {
        status: VenueStatusEnum.Active,
        keyword: 'venue',
        page: 1,
        limit: 0,
        userId: 1,
      } as VenueQuery;

      const mockVenues = [
        {
          id: 1,
          name: 'san bong lu doan',
        },
        { id: 2, name: 'san bong trang bom' },
      ] as Venue[];
      const pageInfo: PageInfoData = {
        page: 1,
        count: 2,
        pageCount: 1,
        pageSize: 2,
      };
      const expectedResult = {
        data: mockVenues,
        pageInfo,
      };

      mockVenueRepository.findAndCount.mockResolvedValue([mockVenues, 2]);

      const result = await venueService.findAllVenues(query);

      expect(result).toEqual(expectedResult);

      expect(mockVenueRepository.findAndCount).toHaveBeenCalledWith({
        relations: {
          pitches: { pitchCategory: true },
          user: true,
        },
        skip: 0,
        take: 0,
        order: {},
        where: {
          status: query.status,
          name: ILike(`%${query.keyword}%`),
          user: {
            id: query.userId,
          },
        },
      });
    });
  });

  describe('findBySlug', () => {
    it('should return a venue by id with specified relations and order', async () => {
      const slug = 'san-bong-lu-doan';
      const mockVenue = { id: 1, name: 'san bong lu doan', slug } as Venue;
      mockVenueRepository.findOne.mockResolvedValue(mockVenue);

      const result = await venueService.findBySlug(slug);

      expect(result).toEqual(mockVenue);
      expect(venueRepository.findOne).toHaveBeenCalledWith({
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
    });
  });

  describe('findByCurrentUser', () => {
    it('should return a venue by current user', async () => {
      const userId = 1;
      const mockVenue = {
        id: 1,
        name: 'san bong lu doan',
        user: {
          id: 1,
        },
      } as Venue;

      mockVenueRepository.findOne.mockResolvedValue(mockVenue);

      const result = await venueService.getVenueByCurrentUser(userId);

      expect(result).toEqual(mockVenue);
      expect(venueRepository.findOne).toHaveBeenCalledWith({
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
    });
  });
});
