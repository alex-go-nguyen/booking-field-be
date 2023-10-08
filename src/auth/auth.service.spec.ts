import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { ForgottenPasswordService } from '../forgotten-password/forgotten-password.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { UserService } from '../user/users.service';
import { AuthService } from './auth.service';
import { ResetPasswordDto } from './dtos/reset-password.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let forgottenPasswordService: ForgottenPasswordService;
  let jwtService: JwtService;
  let mailerService: MailerService;
  let configService: ConfigService;

  const mockUserService = {
    findByUsername: jest.fn(),
    create: jest.fn(),
    setPassword: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockForgottenPasswordService = {
    getForgottenPasswordModel: jest.fn(),
    remove: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  };

  const mockMailerService = { sendMail: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ForgottenPasswordService,
          useValue: mockForgottenPasswordService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
        {
          provide: ConfigService,
          useValue: {
            // Mock ConfigService methods as needed
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    forgottenPasswordService = module.get<ForgottenPasswordService>(ForgottenPasswordService);
    jwtService = module.get<JwtService>(JwtService);
    mailerService = module.get<MailerService>(MailerService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('handleVerifyToken', () => {
    it('should return a user when a valid token is provided', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 1 });

      mockUserService.findOne.mockResolvedValue({ id: 1 });

      const token = 'valid-token';
      const result = await authService.handleVerifyToken(token);

      expect(result).toEqual({ id: 1 });
    });

    it('should throw UnauthorizedException when an invalid token is provided', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error());

      const token = 'invalid-token';

      await expect(authService.handleVerifyToken(token)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signIn', () => {
    it('should return an access token and user when valid credentials are provided', async () => {
      const mockUsername = 'testuser';
      const mockPassword = 'password';
      const mockUser = { id: 1, username: mockUsername, password: 'hashedpassword' };
      const mockAccessToken = 'mock-access-token';

      mockUserService.findByUsername.mockResolvedValue(mockUser);

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      mockJwtService.sign.mockReturnValue(mockAccessToken);

      const result = await authService.signIn(mockUsername, mockPassword);

      expect(result.accessToken).toEqual(mockAccessToken);
      expect(result.user).toEqual(expect.objectContaining({ id: 1, username: mockUsername }));
    });

    it('should throw UnauthorizedException when invalid credentials are provided', async () => {
      const mockInvalidUsername = 'invaliduser';
      const mockInvalidPassword = 'invalidpassword';

      mockUserService.findByUsername.mockResolvedValue(null);

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve());

      await expect(authService.signIn(mockInvalidUsername, mockInvalidPassword)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signUp', () => {
    it('should return an access token and user when a valid user is created', async () => {
      const mockCreateUserDto = { username: 'newuser', password: 'newpassword' } as CreateUserDto;
      const mockUser = { id: 2, ...mockCreateUserDto, password: 'hashedpassword' };
      const mockAccessToken = 'mock-access-token';

      mockUserService.create.mockResolvedValue(mockUser);

      mockJwtService.sign.mockReturnValue(mockAccessToken);

      const result = await authService.signUp(mockCreateUserDto);

      expect(result.accessToken).toEqual(mockAccessToken);
      expect(result.user).toEqual(expect.objectContaining({ id: 2, ...mockCreateUserDto, password: undefined }));
    });
  });

  describe('resetPassword', () => {
    it('should reset the password when a valid reset token is provided', async () => {
      const mockResetPasswordDto = { newPassword: 'newpassword', resetToken: 'reset-token' };
      const mockForgottenPassword = { email: 'test@example.com' };

      mockForgottenPasswordService.getForgottenPasswordModel.mockResolvedValue(mockForgottenPassword);

      mockUserService.setPassword.mockResolvedValue(true);

      mockForgottenPasswordService.remove.mockResolvedValue(true);

      const result = await authService.resetPassword(mockResetPasswordDto);

      expect(result).toEqual(true);
    });
  });

  describe('createForgottenPasswordToken', () => {
    it('should create a forgotten password token for a valid email', async () => {
      const mockEmail = 'test@example.com';
      const mockResetToken = 'reset-token';

      const expiredTime = 12 * 60 * 60 * 1000;

      mockForgottenPasswordService.findOne.mockResolvedValue(null);

      mockForgottenPasswordService.create.mockResolvedValue({
        email: mockEmail,
        resetToken: mockResetToken,
        expiredAt: new Date(new Date().getTime() + expiredTime),
      });

      mockForgottenPasswordService.update.mockResolvedValue(true);

      Math.random = jest.fn().mockReturnValue(0.12345);

      const result = await authService.createForgottenPasswordToken(mockEmail);

      expect(result.email).toEqual(mockEmail);
      expect(result.resetToken).toEqual(mockResetToken);
    });
  });
});
