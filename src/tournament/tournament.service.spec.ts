import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageInfoData } from 'src/common/dtos/base.dto';
import { BaseQuery } from 'src/common/dtos/query.dto';
import { OrderEnum } from 'src/common/enums/order.enum';
import { Repository } from 'typeorm';
import { MatchService } from '../match/match.service';
import { RoundService } from '../round/round.service';
import { TeamService } from '../team/team.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { Tournament } from './entities/tournament.entity';
import { ModeEnum, TournamentTypeEnum } from './enums/tournament.enum';
import { TournamentService } from './tournament.service';

describe('TournamentService', () => {
  let service: TournamentService;
  let tournamentRepository: Repository<Tournament>;
  let teamService: TeamService;
  let roundService: RoundService;
  let matchService: MatchService;

  const mockTournamentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  const mockTeamService = {
    createTeams: jest.fn(),
  };

  const mockRoundService = {
    create: jest.fn(),
  };

  const mockMatchService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentService,
        {
          provide: getRepositoryToken(Tournament),
          useValue: mockTournamentRepository,
        },
        {
          provide: TeamService,
          useValue: mockTeamService,
        },
        {
          provide: RoundService,
          useValue: mockRoundService,
        },
        {
          provide: MatchService,
          useValue: mockMatchService,
        },
      ],
    }).compile();

    service = module.get<TournamentService>(TournamentService);
    tournamentRepository = module.get<Repository<Tournament>>(getRepositoryToken(Tournament));
    teamService = module.get<TeamService>(TeamService);
    roundService = module.get<RoundService>(RoundService);
    matchService = module.get<MatchService>(MatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllTournaments', () => {
    it('should find and count tournaments with the given query', async () => {
      const query: BaseQuery = { page: 1, limit: 0 };
      const tournaments = [{ id: 1 }, { id: 2 }];
      const pageInfo: PageInfoData = {
        page: 1,
        pageSize: 2,
        pageCount: 1,
        count: 2,
      };
      const totalCount = 2;

      mockTournamentRepository.findAndCount.mockResolvedValue([tournaments, totalCount]);

      const result = await service.findAllTournaments(query);

      expect(mockTournamentRepository.findAndCount).toHaveBeenCalledWith({
        order: {
          rounds: {
            matches: {
              id: OrderEnum.Asc,
            },
          },
        },
        relations: {
          pitchCategory: true,
          rounds: {
            matches: {
              guest: true,
              host: true,
            },
          },
          teams: true,
          user: true,
          venue: true,
        },
        skip: 0,
        take: 0,
      });
      expect(result).toEqual({ data: tournaments, pageInfo });
    });
  });

  describe('findByCurrentUser', () => {
    it('should return tournaments for the current user with specified relations and order', async () => {
      const query: BaseQuery = { page: 1, limit: 0 };
      const userId = 1;
      const expectedTournaments = [{ id: 1 }, { id: 2 }];
      const pageInfo: PageInfoData = {
        page: 1,
        pageCount: 1,
        pageSize: 2,
        count: 2,
      };
      mockTournamentRepository.findAndCount.mockResolvedValue([expectedTournaments, 2]);

      const result = await service.findByCurrentUser(query, userId);

      expect(result).toEqual({
        data: expectedTournaments,
        pageInfo,
      });
      expect(mockTournamentRepository.findAndCount).toHaveBeenCalledWith({
        order: {
          rounds: {
            matches: {
              id: OrderEnum.Asc,
            },
          },
        },
        relations: {
          pitchCategory: true,
          rounds: {
            matches: {
              guest: true,
              host: true,
            },
          },
          teams: true,
          user: true,
          venue: true,
        },
        skip: 0,
        take: 0,
        where: {
          user: {
            id: 1,
          },
        },
      });
    });
  });

  describe('findById', () => {
    it('should return a tournament by id with specified relations and order', async () => {
      const id = 1;
      const expectedTournament = { id: 1 };
      mockTournamentRepository.findOne.mockResolvedValue(expectedTournament);

      const result = await service.findById(id);

      expect(result).toEqual(expectedTournament);
      expect(mockTournamentRepository.findOne).toHaveBeenCalledWith({
        relations: {
          teams: true,
          rounds: {
            matches: {
              host: true,
              guest: true,
            },
          },
          user: true,
          venue: true,
          pitchCategory: true,
        },
        order: {
          rounds: {
            matches: {
              id: OrderEnum.Asc,
            },
          },
        },
        where: {
          id,
        },
      });
    });
  });

  describe('createTournament', () => {
    it('should create a tournament with the specified parameters', async () => {
      const createTournamentDto: CreateTournamentDto = {
        totalTeam: 4,
        type: TournamentTypeEnum.RoundRobin,
        cover: '',
        mode: ModeEnum.Private,
        name: 'champion league',
        pitchCategory: 1,
        venue: 1,
      };
      const userId = 1;

      const expectedTeams = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

      mockTournamentRepository.create.mockResolvedValue(createTournamentDto);
      mockTournamentRepository.save.mockResolvedValue(createTournamentDto);

      mockTeamService.createTeams.mockResolvedValue(expectedTeams);

      mockRoundService.create.mockResolvedValue({ id: 1 });

      mockMatchService.create.mockResolvedValue({ id: 1 });

      const result = await service.createTournament(createTournamentDto, userId);

      createTournamentDto.type = TournamentTypeEnum.Knockout;
      await service.createTournament(createTournamentDto, userId);

      createTournamentDto.totalTeam = 8;
      await service.createTournament(createTournamentDto, userId);

      expect(result).toEqual(createTournamentDto);
      expect(mockTournamentRepository.create).toHaveBeenCalledWith({
        ...createTournamentDto,
        user: userId,
      });
      expect(mockTeamService.createTeams).toHaveBeenCalledWith(createTournamentDto.totalTeam, result.id);
      expect(mockRoundService.create).toHaveBeenCalled();
      expect(mockMatchService.create).toHaveBeenCalled();
    });
  });
});
