import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { ForgottenPassword } from 'src/user/entities/forgotten-password.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ForgottenPasswordService extends BaseService<ForgottenPassword, unknown> {
  constructor(
    @InjectRepository(ForgottenPassword) private readonly forgottenPasswordRepository: Repository<ForgottenPassword>,
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

  remove(forgottenPassword: ForgottenPassword) {
    return this.forgottenPasswordRepository.remove(forgottenPassword);
  }
}
