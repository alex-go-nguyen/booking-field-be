import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetRoundsQuery } from './dto/query.dto';
import { Round } from './entities/round.entity';
import { RoundService } from './round.service';

describe('RoundService', () => {
  let service: RoundService;
  let roundRepository: Repository<Round>;

  const mockRoundRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoundService,
        {
          provide: getRepositoryToken(Round),
          useValue: mockRoundRepository,
        },
      ],
    }).compile();

    service = module.get<RoundService>(RoundService);
    roundRepository = module.get<Repository<Round>>(getRepositoryToken(Round));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllRound', () => {
    it('should find and count rounds with given query', async () => {
      const query: GetRoundsQuery = {
        tournamentId: 1,
        page: 1,
        limit: 0,
      };

      const rounds = [{ id: 1 }, { id: 2 }];
      const totalCount = 2;

      mockRoundRepository.findAndCount.mockResolvedValue([rounds, totalCount]);

      const result = await service.findAllRound(query);

      expect(mockRoundRepository.findAndCount).toHaveBeenCalledWith({
        take: 0,
        skip: 0,
        order: {},
        where: {
          tournament: {
            id: query.tournamentId,
          },
        },
      });
      expect(result).toEqual({
        data: rounds,
        pageInfo: {
          count: 2,
          page: 1,
          pageCount: 1,
          pageSize: 2,
        },
      });
    });

    it('should find and count all rounds when no query provided', async () => {
      const query = {} as GetRoundsQuery;

      const rounds = [{ id: 1 }, { id: 2 }];
      const totalCount = 2;

      mockRoundRepository.findAndCount.mockResolvedValue([rounds, totalCount]);

      const result = await service.findAllRound(query);

      expect(mockRoundRepository.findAndCount).toHaveBeenCalledWith({ take: 0, skip: 0, order: {}, where: {} });
      expect(result).toEqual({
        data: rounds,
        pageInfo: {
          count: 2,
          page: undefined,
          pageCount: 1,
          pageSize: 2,
        },
      });
    });
  });

  describe('findById', () => {
    it('should find a round by ID', async () => {
      const roundId = 1;
      const round = { id: roundId };

      mockRoundRepository.findOne.mockResolvedValue(round);

      const result = await service.findById(roundId);

      expect(mockRoundRepository.findOne).toHaveBeenCalledWith({ where: { id: roundId } });
      expect(result).toEqual(round);
    });

    it('should return null when no round found with the given ID', async () => {
      const roundId = 1;

      mockRoundRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(roundId);

      expect(mockRoundRepository.findOne).toHaveBeenCalledWith({ where: { id: roundId } });
      expect(result).toBeNull();
    });
  });
});
