import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';

const mockMatch = () => {
  return {
    id: 1,
    hostGoals: 4,
    guestGoals: 2,
  };
};

const mockMatches = () => {
  return [
    {
      id: 1,
      hostGoals: 4,
      guestGoals: 2,
    },
    {
      id: 2,
      hostGoals: 3,
      guestGoals: 2,
    },
    {
      id: 3,
      hostGoals: 1,
      guestGoals: 2,
    },
    {
      id: 4,
      hostGoals: 2,
      guestGoals: 2,
    },
  ];
};

const matchServiceMock: Partial<MatchService> = {
  findOne: jest.fn().mockResolvedValue(mockMatch()),
  findAll: jest.fn().mockResolvedValue(mockMatches()),
};

describe('RoundService', () => {
  let service: MatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchService, { provide: MatchService, useValue: matchServiceMock }],
    }).compile();

    service = module.get<MatchService>(MatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMatch', () => {
    it('should return match', async () => {
      const result = {
        id: 1,
        hostGoals: 4,
        guestGoals: 2,
      };

      matchServiceMock.findOne = jest.fn().mockResolvedValue(result);

      await expect(
        service.findOne({
          where: {
            id: 1,
          },
        }),
      ).resolves.toEqual(result);
    });
  });

  describe('getAllMatchOfTournament', () => {
    it('should return array of team', async () => {
      const results = [
        {
          id: 1,
          hostGoals: 4,
          guestGoals: 2,
        },
        {
          id: 2,
          hostGoals: 3,
          guestGoals: 2,
        },
        {
          id: 3,
          hostGoals: 1,
          guestGoals: 2,
        },
        {
          id: 4,
          hostGoals: 2,
          guestGoals: 2,
        },
      ];
      matchServiceMock.findAll = jest.fn().mockResolvedValue(results);

      await expect(service.findAll()).resolves.toEqual(results);
    });
  });
});
