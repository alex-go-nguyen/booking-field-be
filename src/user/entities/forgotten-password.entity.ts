import { TABLES } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity(TABLES.forgottenPassword)
export class ForgottenPassowrd extends Base {
  @Column()
  email: string;

  @Column()
  resetToken: string;

  @Column()
  expiredAt: Date;
}
