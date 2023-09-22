import { Test, TestingModule } from '@nestjs/testing';
import { ForgottenPasswordService } from './forgotten-password.service';

const mockForgotPassword = () => {
  return {
    id: 1,
    email: 'alex133@gmail.com',
    resetToken: 'asgabadsd9213m121jn321kc21123nsdas',
  };
};

const matchServiceMock: Partial<ForgottenPasswordService> = {
  findOne: jest.fn().mockResolvedValue(mockForgotPassword()),
};

describe('ForgottenPasswordService', () => {
  let service: ForgottenPasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForgottenPasswordService, { provide: ForgottenPasswordService, useValue: matchServiceMock }],
    }).compile();

    service = module.get<ForgottenPasswordService>(ForgottenPasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getToken', () => {
    it('should return token', async () => {
      const result = {
        id: 1,
        email: 'alex133@gmail.com',
        resetToken: 'asgabadsd9213m121jn321kc21123nsdas',
      };

      matchServiceMock.findOne = jest.fn().mockResolvedValue(result);

      await expect(
        service.findOne({
          where: {
            email: 'alex133@gmail.com',
          },
        }),
      ).resolves.toEqual(result);
    });
  });
});
