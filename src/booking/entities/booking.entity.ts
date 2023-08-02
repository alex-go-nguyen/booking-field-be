import { TABLE } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import User from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity(TABLE.Booking)
export class Booking extends Base {
  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @ManyToOne(() => Pitch, (pitch) => pitch.bookings)
  @JoinColumn()
  pitch: Pitch;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn()
  user: User;

  @OneToOne(() => Rating)
  @JoinColumn()
  rating: Rating;
}
