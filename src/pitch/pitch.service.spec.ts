import { Test, TestingModule } from '@nestjs/testing';
import { PitchService } from './pitch.service';

const mockPitch = () => {
  return {
    id: 1,
    name: 'Sân 1',
    price: 120000,
  };
};

const mockPitches = () => {
  return [
    {
      id: 1,
      name: 'Sân 1',
      price: 24000,
    },
    {
      id: 2,
      name: 'Sân 2',
      price: 120000,
    },
    {
      id: 3,
      name: 'Sân 3',
      price: 130000,
    },
    {
      id: 4,
      name: 'Sân 4',
      price: 120000,
    },
  ];
};

const pitchServiceMock: Partial<PitchService> = {
  findOne: jest.fn().mockResolvedValue(mockPitch()),
  findAll: jest.fn().mockResolvedValue(mockPitches()),
};

describe('PitchService', () => {
  let service: PitchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PitchService, { provide: PitchService, useValue: pitchServiceMock }],
    }).compile();

    service = module.get<PitchService>(PitchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPitch', () => {
    it('should return pitch', async () => {
      const result = {
        id: 1,
        name: 'Sân 1',
        price: 24000,
      };

      pitchServiceMock.findOne = jest.fn().mockResolvedValue(result);

      await expect(
        service.findOne({
          where: {
            id: 1,
          },
        }),
      ).resolves.toEqual(result);
    });
  });

  describe('getAllPitch', () => {
    it('should return array of pitch', async () => {
      const results = [
        {
          id: 1,
          name: 'Sân 1',
          price: 24000,
        },
        {
          id: 2,
          name: 'Sân 2',
          price: 120000,
        },
        {
          id: 3,
          name: 'Sân 3',
          price: 130000,
        },
        {
          id: 4,
          name: 'Sân 4',
          price: 120000,
        },
      ];

      pitchServiceMock.findAll = jest.fn().mockResolvedValue(results);

      await expect(service.findAll()).resolves.toEqual(results);
    });
  });
});
