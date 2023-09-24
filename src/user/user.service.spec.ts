import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';

const mockUser = () => {
  return {
    id: 1,
    firstName: 'Nguyen',
    lastName: 'Alex',
    username: 'alex123',
    email: 'alex@gmail.com',
  };
};

const mockUsers = () => {
  return [
    {
      id: 1,
      firstName: 'Nguyen',
      lastName: 'Alex',
      username: 'alex123',
      email: 'alex@gmail.com',
    },
    {
      id: 2,
      firstName: 'Tran',
      lastName: 'Alex',
      username: 'alex133',
      email: 'alex13@gmail.com',
    },
  ];
};

const userServiceMock: Partial<UserService> = {
  findOne: jest.fn().mockResolvedValue(mockUser()),
  findAll: jest.fn().mockResolvedValue(mockUsers()),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: UserService, useValue: userServiceMock }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRating', () => {
    it('should return rating', async () => {
      const result = {
        id: 1,
        firstName: 'Nguyen',
        lastName: 'Alex',
        username: 'alex123',
        email: 'alex@gmail.com',
      };

      userServiceMock.findOne = jest.fn().mockResolvedValue(result);

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
          firstName: 'Nguyen',
          lastName: 'Alex',
          username: 'alex123',
          email: 'alex@gmail.com',
        },
        {
          id: 2,
          firstName: 'Tran',
          lastName: 'Alex',
          username: 'alex133',
          email: 'alex13@gmail.com',
        },
      ];

      userServiceMock.findAll = jest.fn().mockResolvedValue(results);

      await expect(service.findAll()).resolves.toEqual(results);
    });
  });
});
