import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetTeamsQuery } from './dto/query.dto';
import { Team } from './entities/team.entity';
import { TeamService } from './team.service';

describe('TeamService', () => {
  let service: TeamService;
  let roundRepository: Repository<Team>;

  const mockTeamRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useValue: mockTeamRepository,
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    roundRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllTeam', () => {
    it('should find and count rounds with given query', async () => {
      const query: GetTeamsQuery = {
        tournamentId: 1,
        page: 1,
        limit: 0,
      };

      const teams = [{ id: 1 }, { id: 2 }];
      const totalCount = 2;

      mockTeamRepository.findAndCount.mockResolvedValue([teams, totalCount]);

      const result = await service.findAllTeams(query);

      expect(mockTeamRepository.findAndCount).toHaveBeenCalledWith({
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
        data: teams,
        pageInfo: {
          count: 2,
          page: 1,
          pageCount: 1,
          pageSize: 2,
        },
      });
    });

    it('should find and count all rounds when no query provided', async () => {
      const query = {} as GetTeamsQuery;

      const rounds = [{ id: 1 }, { id: 2 }];
      const totalCount = 2;

      mockTeamRepository.findAndCount.mockResolvedValue([rounds, totalCount]);

      const result = await service.findAllTeams(query);

      expect(mockTeamRepository.findAndCount).toHaveBeenCalledWith({
        take: 0,
        skip: 0,
        order: {},
        where: {
          tournament: {
            id: undefined,
          },
        },
      });
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
      const teamId = 1;
      const round = { id: teamId };

      mockTeamRepository.findOne.mockResolvedValue(round);

      const result = await service.findById(teamId);

      expect(mockTeamRepository.findOne).toHaveBeenCalledWith({ where: { id: teamId } });
      expect(result).toEqual(round);
    });

    it('should return null when no round found with the given ID', async () => {
      const teamId = 1;

      mockTeamRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(teamId);

      expect(mockTeamRepository.findOne).toHaveBeenCalledWith({ where: { id: teamId } });
      expect(result).toBeNull();
    });
  });

  describe('createTeams', () => {
    it('should create and return teams with given total and tournament ID', async () => {
      const totalTeam = 3;
      const tournamentId = 1;
      const createdTeams = [
        { name: '1', tournament: tournamentId },
        { name: '2', tournament: tournamentId },
        { name: '3', tournament: tournamentId },
      ];

      mockTeamRepository.create.mockReturnValue(createdTeams);
      mockTeamRepository.save.mockResolvedValue(createdTeams);

      await service.createTeams(totalTeam, tournamentId);

      expect(mockTeamRepository.create).toHaveBeenCalledTimes(totalTeam);
      expect(mockTeamRepository.save).toHaveBeenCalledWith(createdTeams);
    });
  });
});
