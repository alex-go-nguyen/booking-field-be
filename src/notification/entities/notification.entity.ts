import { TABLES } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import User from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity(TABLES.notification)
export class Notification extends Base {
  @Column()
  title: string;

  @Column()
  message: string;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
