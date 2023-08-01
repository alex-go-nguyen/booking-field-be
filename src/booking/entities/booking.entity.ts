import { TABLE } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { SubField } from 'src/sub-field/entities/sub-field.entity';
import User from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity(TABLE.Booking)
export class Booking extends Base {
  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @ManyToOne(() => SubField, (subField) => subField.bookings)
  @JoinColumn()
  subField: number;

  @ManyToOne(() => User, (user) => user.booking)
  @JoinColumn()
  user: number;
}
