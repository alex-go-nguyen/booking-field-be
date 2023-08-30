import { Booking } from 'src/booking/entities/booking.entity';
import { TABLES } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { PitchCategory } from 'src/pitch-category/entities/pitch-category.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity(TABLES.pitch)
export class Pitch extends Base {
  @Column()
  no: number;

  @ManyToOne(() => PitchCategory, (pitchCategory) => pitchCategory.pitches)
  @JoinColumn()
  pitchCategory: PitchCategory;

  @Column()
  price: number;

  @ManyToOne(() => Venue, (venue) => venue.pitches)
  @JoinColumn()
  venue: Venue;

  @OneToMany(() => Booking, (booking) => booking.pitch)
  bookings: Booking[];
}
