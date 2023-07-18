import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class UserService extends BaseService<User, CreateUserDto> {
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

    createUserInput.password = await bcrypt.hash(createUserInput.password, 10);

    const user = this.userRepository.create(createUserInput);

    await this.userRepository.save(user);

    user.password = undefined;

    return user;
  }
}
