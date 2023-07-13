import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import User from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(username: string) {
    return this.userRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  async create(createUserInput: CreateUserInput) {
    const existUser = await this.findOne(createUserInput.username);

    if (existUser) {
      throw new ConflictException('This username is already registered');
    }

    createUserInput.password = await bcrypt.hash(createUserInput.password, 10);

    const user = this.userRepository.create(createUserInput);

    await this.userRepository.save(user);

    return user;
  }
}
