import { Booking } from 'src/booking/entities/booking.entity';
import { TABLE } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity(TABLE.Rating)
export class Rating extends Base {
  @Column()
  content: string;

  @Column({ type: 'decimal', precision: 5, scale: 1, default: 0 })
  rate: number;

  @OneToOne(() => Booking, (booking) => booking.rating)
  @JoinColumn()
  booking: Booking;
}
