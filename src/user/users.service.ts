import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import User from './entities/user.entity';

@Injectable()
export class UserService extends BaseService<User, unknown> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async me(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    user.password = undefined;

    return user;
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  async create(createUserInput: CreateUserDto) {
    const existUser = await this.findByUsername(createUserInput.username);

    if (existUser) {
      throw new ConflictException('This username is already registered');
    }

    const user = this.userRepository.create(createUserInput);

    await this.userRepository.save(user);

    user.password = undefined;

    return user;
  }
}
