import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';

const mockTeam = () => {
  return {
    name: 'team 1',
    avatar: 'img-url',
    contact: '0123456789',
  };
};

const mockTeams = () => {
  return [
    {
      name: 'team 1',
      avatar: 'img-url',
      contact: '0123456789',
    },
    {
      name: 'team 2',
      avatar: 'img-url',
      contact: '0123456789',
    },
    {
      name: 'team 3',
      avatar: 'img-url',
      contact: '0123456789',
    },
    {
      name: 'team 4',
      avatar: 'img-url',
      contact: '0123456789',
    },
  ];
};

const teamServiceMock: Partial<TeamService> = {
  findOne: jest.fn().mockResolvedValue(mockTeam()),
  findAll: jest.fn().mockResolvedValue(mockTeams()),
};

describe('RoundService', () => {
  let service: TeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamService, { provide: TeamService, useValue: teamServiceMock }],
    }).compile();

    service = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTeam', () => {
    it('should return round', async () => {
      const result = {
        name: 'team 1',
        avatar: 'img-url',
        contact: '0123456789',
      };

      teamServiceMock.findOne = jest.fn().mockResolvedValue(result);

      await expect(
        service.findOne({
          where: {
            id: 1,
          },
        }),
      ).resolves.toEqual(result);
    });
  });

  describe('getAllTeams', () => {
    it('should return array of team', async () => {
      const results = [
        {
          name: 'team 1',
          avatar: 'img-url',
          contact: '0123456789',
        },
        {
          name: 'team 2',
          avatar: 'img-url',
          contact: '0123456789',
        },
        {
          name: 'team 3',
          avatar: 'img-url',
          contact: '0123456789',
        },
        {
          name: 'team 4',
          avatar: 'img-url',
          contact: '0123456789',
        },
      ];
      teamServiceMock.findAll = jest.fn().mockResolvedValue(results);

      await expect(service.findAll()).resolves.toEqual(results);
    });
  });
});
