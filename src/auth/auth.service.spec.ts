import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { AuthService } from './auth.service';

const mockAuth = () => {
  return {
    accessToken: 'n328132183dj8391238cj213jcjhfnnj123n23i21',
    user: {
      id: 1,
      username: 'alex',
      email: 'alex@gmail.com',
    },
  };
};

const mockRegister = (): CreateUserDto => {
  return {
    firstName: 'Nguyen',
    lastName: 'Alex',
    username: 'alex',
    password: 'alex123',
    email: 'alex@gmail.com',
    phone: '0123456789',
  };
};

const authServiceMock: Partial<AuthService> = {
  signIn: jest.fn().mockResolvedValue(mockAuth()),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: AuthService, useValue: authServiceMock }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return accessToken and user', async () => {
      const result = {
        accessToken: 'n328132183dj8391238cj213jcjhfnnj123n23i21',
        user: {
          id: 1,
          username: 'alex',
          email: 'alex@gmail.com',
        },
      };

      await expect(service.signIn('alex', 'alex123')).resolves.toEqual(result);
    });
  });

  describe('signUp', () => {
    it('should return accessToken and user', async () => {
      const result = {
        accessToken: 'n328132183dj8391238cj213jcjhfnnj123n23i21',
        user: {
          id: 1,
          username: 'alex',
          email: 'alex@gmail.com',
        },
      };

      authServiceMock.signUp = jest.fn().mockResolvedValue(mockAuth());

      await expect(service.signUp(mockRegister())).resolves.toEqual(result);
    });
  });
});
