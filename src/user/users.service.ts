import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from 'src/common/enums/role.enum';
import { BaseService } from 'src/common/services/base.service';
import { StripeService } from 'src/stripe/stripe.service';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import User from './entities/user.entity';

@Injectable()
export class UserService extends BaseService<User, CreateUserDto> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly stripeService: StripeService,
  ) {
    super(userRepository);
  }

  async me(username: string) {
    const user = await this.userRepository.findOne({ where: { username }, relations: { venue: true } });
    user.password = undefined;

    return user;
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({
      where: {
        username,
      },
      relations: {
        venue: true,
      },
    });
  }

  async create(createUserInput: CreateUserDto) {
    const existUser = await this.findByUsername(createUserInput.username);

    if (existUser) {
      throw new ConflictException('This username is already registered');
    }

    const stripeCustomer = await this.stripeService.createCustomer(createUserInput.username, createUserInput.email);

    const user = this.userRepository.create({
      ...createUserInput,
      role: RoleEnum.User,
      stripeCustomerId: stripeCustomer.id,
    });

    await this.userRepository.save(user);

    user.password = undefined;

    return user;
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.findOne({
      where: {
        _id: userId,
      },
    });

    const isPasswordMatching = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordMatching) {
      throw new BadRequestException('Invalid password');
    }

    const updatedData = this.userRepository.create({ ...user, password: newPassword });

    const result = await this.repo.save(updatedData);

    result.password = undefined;

    return result;
  }

  async setPassword(email: string, newPassword: string) {
    const user = await this.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedData = this.userRepository.create({ ...user, password: newPassword });

    const result = await this.repo.save(updatedData);

    return result;
  }
}
