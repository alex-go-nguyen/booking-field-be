import { Test, TestingModule } from '@nestjs/testing';
import { RoundService } from './round.service';

const mockRound = () => {
  return { id: 1, no: 1 };
};

const mockRounds = () => {
  return [
    { id: 1, no: 1 },
    { id: 2, no: 2 },
    { id: 3, no: 3 },
    { id: 4, no: 4 },
    { id: 5, no: 5 },
  ];
};

const roundServiceMock: Partial<RoundService> = {
  findOne: jest.fn().mockResolvedValue(mockRound()),
  findAll: jest.fn().mockResolvedValue(mockRounds()),
};

describe('RoundService', () => {
  let service: RoundService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoundService, { provide: RoundService, useValue: roundServiceMock }],
    }).compile();

    service = module.get<RoundService>(RoundService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRoundByTournament', () => {
    it('should return round', async () => {
      const result = {
        id: 1,
        no: 1,
      };

      roundServiceMock.findOne = jest.fn().mockResolvedValue(result);

      await expect(
        service.findOne({
          where: {
            tournament: {
              id: 3,
            },
          },
        }),
      ).resolves.toEqual(result);
    });
  });

  describe('getAllRounds', () => {
    it('should return array of round', async () => {
      const results = [
        { id: 1, no: 1 },
        { id: 2, no: 2 },
        { id: 3, no: 3 },
        { id: 4, no: 4 },
        { id: 5, no: 5 },
      ];
      roundServiceMock.findAll = jest.fn().mockResolvedValue(results);

      await expect(service.findAll()).resolves.toEqual(results);
    });
  });
});
