import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageInfoData } from 'src/common/dtos/base.dto';
import { Round } from 'src/round/entities/round.entity';
import { Team } from 'src/team/entities/team.entity';
import { TeamService } from 'src/team/team.service';
import { Tournament } from 'src/tournament/entities/tournament.entity';
import { TournamentTypeEnum } from 'src/tournament/enums/tournament.enum';
import { Repository } from 'typeorm';
import { GetMatchesQuery } from './dto/match-query.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match } from './entities/match.entity';
import { MatchService } from './match.service';

describe('MatchService', () => {
  let matchService: MatchService;
  let matchRepository: Repository<Match>;
  let teamService: TeamService;

  const mockNotificationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  const mockTeamService = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: getRepositoryToken(Match),
          useClass: Repository,
        },
        {
          provide: TeamService,
          useValue: {
            mockTeamService,
          },
        },
      ],
    }).compile();

    matchService = module.get<MatchService>(MatchService);
    matchRepository = module.get<Repository<Match>>(getRepositoryToken(Match));
    teamService = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(matchService).toBeDefined();
  });

  describe('findAllMatches', () => {
    it('should return all matches based on query', async () => {
      const query: GetMatchesQuery = {
        tournamentId: 1,
        page: 1,
        limit: 0,
      };
      const mockMatches = [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ] as Match[];
      const expectedResult = mockMatches;

      const pageInfo: PageInfoData = {
        page: 1,
        pageCount: 1,
        pageSize: 2,
        count: 2,
      };

      matchRepository.findAndCount = jest.fn().mockResolvedValue([expectedResult, expectedResult.length]);

      const result = await matchService.findAllMatches(query);

      expect(result).toEqual({
        data: expectedResult,
        pageInfo,
      });
    });
  });

  describe('findById', () => {
    it('should return a match by ID with related data', async () => {
      const matchId = 1;
      const expectedResult: Match | undefined = undefined;

      matchRepository.findOne = jest.fn().mockResolvedValue(expectedResult);

      const result = await matchService.findById(matchId);

      expect(result).toEqual(expectedResult);

      expect(matchRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: matchId,
        },
        relations: {
          host: true,
          guest: true,
          round: {
            tournament: true,
          },
        },
      });
    });
  });

  describe('updateMatch', () => {
    it('should update a match and related teams based on the result', async () => {
      const matchId = 1;
      const updateData: UpdateMatchDto = {
        hostGoals: 2,
        guestGoals: 1,
      };

      const mockTournament = { id: 1, type: TournamentTypeEnum.Knockout } as Tournament;

      const mockRound = {
        id: 1,
        tournament: mockTournament,
      } as Round;

      const mockTeamHost: Team = {
        id: 1,
        avatar: '',
        contact: '',
        contactName: '',
        name: 'host',
        tournament: mockTournament,
      } as Team;

      const mockTeamGuest = {
        id: 2,
        avatar: '',
        contact: '',
        contactName: '',
        name: 'guest',
        tournament: mockTournament,
      } as Team;

      const mockMatch = {
        id: 1,
        host: mockTeamHost,
        guest: mockTeamGuest,
        round: mockRound,
      } as Match;

      const expectedResult = mockMatch;

      matchRepository.update = jest.fn().mockResolvedValue({ affected: 1 });
      matchRepository.findOne = jest.fn().mockResolvedValue(expectedResult);

      teamService.update = jest.fn().mockResolvedValue(mockTeamHost);
      teamService.update = jest.fn().mockResolvedValue(mockTeamGuest);

      const result = await matchService.updateMatch(matchId, updateData);

      expect(result).toEqual(expectedResult);

      expect(matchRepository.update).toHaveBeenCalledWith(matchId, updateData);

      expect(teamService.update).toHaveBeenCalledWith(expectedResult.host.id, expect.any(Object));
      expect(teamService.update).toHaveBeenCalledWith(expectedResult.guest.id, expect.any(Object));
    });
  });
});
