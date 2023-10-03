import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { RoleEnum } from '../common/enums/role.enum';
import { StripeService } from '../stripe/stripe.service';
import { CreateUserDto } from './dtos/create-user.dto';
import User from './entities/user.entity';
import { UserService } from './users.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let stripeService: StripeService;

  const mockUserRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockBcrypt = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const mockStripeService = {
    createCustomer: jest.fn(),
  };

  const mockUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password',
    firstName: 'admin',
    lastName: 'admin',
    phone: '0354560042',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: StripeService,
          useValue: mockStripeService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    stripeService = module.get<StripeService>(StripeService);
    (bcrypt.compare as jest.Mock) = mockBcrypt.compare;
    (bcrypt.hash as jest.Mock) = mockBcrypt.hash;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        firstName: 'admin',
        lastName: 'admin',
        phone: '0354560042',
      };

      const mockStripeCustomer = { id: 'stripeCustomerId' };
      mockStripeService.createCustomer.mockResolvedValue(mockStripeCustomer);

      const mockCreatedUser = {
        id: 1,
        username: createUserDto.username,
        email: createUserDto.email,
        role: RoleEnum.User,
        stripeCustomerId: mockStripeCustomer.id,
      };

      mockUserRepository.create.mockReturnValue(mockCreatedUser);

      const result = await userService.create(createUserDto);

      expect(result).toEqual(mockCreatedUser);
      expect(stripeService.createCustomer).toHaveBeenCalledWith(createUserDto.username, createUserDto.email);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        role: RoleEnum.User,
        stripeCustomerId: mockStripeCustomer.id,
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockCreatedUser);
    });

    it('should throw a ConflictException when a user with the same username already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        firstName: 'admin',
        lastName: 'admin',
        phone: '0354560042',
      };

      const existingUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        firstName: 'admin',
        lastName: 'admin',
        phone: '0354560042',
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);

      await expect(userService.create(createUserDto)).rejects.toThrowError(ConflictException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { username: createUserDto.username } });
    });
  });

  describe('findByUsername', () => {
    it('should find a user by username', async () => {
      const username = 'testuser';

      mockUserRepository.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.findByUsername(username);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username },
        relations: { venue: true },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('changePassword', () => {
    it('should change the user password', async () => {
      const userId = 1;
      const currentPassword = 'currentPassword';
      const newPassword = 'newPassword';
      const hashedNewPassword = 'hashedNewPassword';

      const mockUser = { id: userId, password: 'hashedCurrentPassword' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      mockBcrypt.compare.mockResolvedValue(true);
      mockBcrypt.hash.mockResolvedValue(hashedNewPassword);

      const updatedUser = { ...mockUser, password: hashedNewPassword };
      mockUserRepository.create.mockReturnValue(updatedUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await userService.changePassword(userId, { currentPassword, newPassword });

      expect(result).toEqual(updatedUser);
      expect(bcrypt.compare).toHaveBeenCalledWith(currentPassword, mockUser.password);
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(userRepository.create).toHaveBeenCalledWith({ ...mockUser, password: hashedNewPassword });
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw a BadRequestException if the current password is incorrect', async () => {
      const userId = 1;
      const currentPassword = 'currentPassword';
      const newPassword = 'newPassword';

      const mockUser = { id: userId, password: 'hashedCurrentPassword' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      mockBcrypt.compare.mockResolvedValue(false);

      await expect(userService.changePassword(userId, { currentPassword, newPassword })).rejects.toThrowError(
        BadRequestException,
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(currentPassword, mockUser.password);
    });
  });

  describe('me', () => {
    it('should return the user with sensitive data removed', async () => {
      const username = 'testuser';
      const mockUser = { id: 1, username, password: 'hashedPassword' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await userService.me(username);

      expect(result).toEqual({ id: mockUser.id, username });
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { username }, relations: { venue: true } });
    });
  });

  describe('setPassword', () => {
    it('should set a new password for the user with the provided email', async () => {
      const email = 'test@example.com';
      const newPassword = 'newPassword';
      const hashedNewPassword = 'hashedNewPassword';

      const mockUser = { id: 1, password: 'hashedCurrentPassword' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      mockBcrypt.hash.mockResolvedValue(hashedNewPassword);

      const updatedUser = { ...mockUser, password: hashedNewPassword };
      mockUserRepository.create.mockReturnValue(updatedUser);
      mockUserRepository.save.mockReturnValue(updatedUser);

      const result = await userService.setPassword(email, newPassword);

      expect(result).toEqual(updatedUser);
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(userRepository.create).toHaveBeenCalledWith({ ...mockUser, password: hashedNewPassword });
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw a NotFoundException if no user is found with the provided email', async () => {
      const email = 'nonexistent@example.com';
      mockUserRepository.findOne.mockResolvedValue(undefined);

      await expect(userService.setPassword(email, 'newPassword')).rejects.toThrowError(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
    });
  });
});
