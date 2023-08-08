import { Booking } from 'src/booking/entities/booking.entity';
import { TABLES } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity(TABLES.rating)
export class Rating extends Base {
  @Column()
  content: string;

  @Column()
  rate: number;

  @OneToOne(() => Booking, (booking) => booking.rating)
  @JoinColumn()
  booking: Booking;
}
