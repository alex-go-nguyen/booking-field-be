import { Booking } from 'src/booking/entities/booking.entity';
import { Base } from 'src/common/entities/base.entity';
import { TABLE } from 'src/common/enums/table.enum';
import { PitchCategory } from 'src/pitch-category/entities/pitch-category.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity(TABLE.Pitch)
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
