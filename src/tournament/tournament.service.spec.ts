import { Test, TestingModule } from '@nestjs/testing';
import { TournamentService } from './tournament.service';

const mockTournament = () => {
  return {
    id: 1,
    name: 'Tournament 1',
    description: 'Best tournament',
  };
};

const mockTournaments = () => {
  return [
    { id: 1, name: 'Tournament 1', description: 'Best tournament' },
    { id: 2, name: 'Tournament 2', description: 'Best tournament' },
    { id: 3, name: 'Tournament 3', description: 'Best tournament' },
    { id: 4, name: 'Tournament 4', description: 'Best tournament' },
    { id: 5, name: 'Tournament 5', description: 'Best tournament' },
  ];
};

const tournamentServiceMock: Partial<TournamentService> = {
  findOne: jest.fn().mockResolvedValue(mockTournament()),
  findAll: jest.fn().mockResolvedValue(mockTournaments()),
};

describe('TournamentService', () => {
  let service: TournamentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TournamentService, { provide: TournamentService, useValue: tournamentServiceMock }],
    }).compile();

    service = module.get<TournamentService>(TournamentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTournamentById', () => {
    it('should return tournament', async () => {
      const results = {
        id: 1,
        name: 'Tournament 1',
        description: 'Best tournament',
      };

      await expect(
        service.findOne({
          where: {
            id: 2,
          },
        }),
      ).resolves.toEqual(results);
    });
  });

  describe('getAllTournament', () => {
    it('should return array of tournament', async () => {
      const results = [
        { id: 1, name: 'Tournament 1', description: 'Best tournament' },
        { id: 2, name: 'Tournament 2', description: 'Best tournament' },
        { id: 3, name: 'Tournament 3', description: 'Best tournament' },
        { id: 4, name: 'Tournament 4', description: 'Best tournament' },
        { id: 5, name: 'Tournament 5', description: 'Best tournament' },
      ];

      await expect(service.findAll()).resolves.toEqual(results);
    });
  });
});
