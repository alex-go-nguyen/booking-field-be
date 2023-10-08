import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetPitchesQuery } from './dtos/pitch-query.dto';
import { Pitch } from './entities/pitch.entity';
import { PitchService } from './pitch.service';

describe('PitchService', () => {
  let service: PitchService;
  let pitchRepository: Repository<Pitch>;

  const mockPitchRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PitchService,
        {
          provide: getRepositoryToken(Pitch),
          useValue: mockPitchRepository,
        },
      ],
    }).compile();

    service = module.get<PitchService>(PitchService);
    pitchRepository = module.get<Repository<Pitch>>(getRepositoryToken(Pitch));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllPitch', () => {
    it('should find and count pitches with given query', async () => {
      const query: GetPitchesQuery = {
        page: 1,
        limit: 0,
        venueId: 1,
        pitchCategoryId: 1,
      };

      const pitches = [{ id: 1 }, { id: 2 }];
      const totalCount = 2;

      mockPitchRepository.findAndCount.mockResolvedValue([pitches, totalCount]);

      const result = await service.findAllPitches(query);

      expect(mockPitchRepository.findAndCount).toHaveBeenCalledWith({
        take: 0,
        skip: 0,
        order: {},
        relations: {
          pitchCategory: true,
          venue: true,
        },
        where: {
          pitchCategory: {
            id: 1,
          },
          venue: {
            id: 1,
          },
        },
      });
      expect(result).toEqual({
        data: pitches,
        pageInfo: {
          count: 2,
          page: 1,
          pageCount: 1,
          pageSize: 2,
        },
      });
    });

    it('should find and count all pitches when no query provided', async () => {
      const query = {} as GetPitchesQuery;

      const pitches = [{ id: 1 }, { id: 2 }];
      const totalCount = 2;

      mockPitchRepository.findAndCount.mockResolvedValue([pitches, totalCount]);

      const result = await service.findAllPitches(query);

      expect(mockPitchRepository.findAndCount).toHaveBeenCalledWith({
        take: 0,
        skip: 0,
        order: {},
        relations: {
          pitchCategory: true,
          venue: true,
        },
        where: {},
      });
      expect(result).toEqual({
        data: pitches,
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
    it('should find a pitch by ID', async () => {
      const id = 1;
      const pitch = { id };

      mockPitchRepository.findOne.mockResolvedValue(pitch);

      const result = await service.findById(id);

      expect(mockPitchRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(pitch);
    });

    it('should return null when no pitch found with the given ID', async () => {
      const id = 1;

      mockPitchRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(id);

      expect(mockPitchRepository.findOne).toHaveBeenCalledWith({ where: { id: id } });
      expect(result).toBeNull();
    });
  });
});
