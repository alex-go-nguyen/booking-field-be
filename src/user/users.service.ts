import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from 'src/common/enums/role.enum';
import { BaseService } from 'src/common/services/base.service';
import { StripeService } from 'src/stripe/stripe.service';
import { Repository } from 'typeorm';
import { AnalystUserQuery } from './dtos/analyst-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import User from './entities/user.entity';

@Injectable()
export class UserService extends BaseService<User, unknown> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private stripeService: StripeService,
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

  analystUserSignIn(query: AnalystUserQuery) {
    const { year, role } = query;
    const qb = this.userRepository
      .createQueryBuilder('u')
      .select("TO_CHAR(DATE_TRUNC('MONTH', u.createdAt), 'mm/dd/yyyy')", 'month')
      .addSelect('COUNT(*)::int', 'total')
      .where("DATE_PART('YEAR', u.createdAt) = :year", { year });

    if (role) {
      qb.andWhere('u.role = :role', { role });
    }

    qb.groupBy("DATE_TRUNC('MONTH', u.createdAt)");

    return qb.getRawMany();
  }
}
