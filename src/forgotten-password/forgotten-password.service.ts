import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { ForgottenPassowrd } from 'src/user/entities/forgotten-password.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ForgottenPasswordService extends BaseService<ForgottenPassowrd, unknown> {
  constructor(
    @InjectRepository(ForgottenPassowrd) private readonly forgottenPasswordRepository: Repository<ForgottenPassowrd>,
  ) {
    super(forgottenPasswordRepository);
  }

  getForgottenPasswordModel(resetToken: string) {
    return this.forgottenPasswordRepository.findOne({
      where: {
        resetToken,
      },
    });
  }

  remove(forgottenPassword: ForgottenPassowrd) {
    return this.forgottenPasswordRepository.remove(forgottenPassword);
  }
}
