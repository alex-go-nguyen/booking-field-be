import * as bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';
import { Booking } from 'src/booking/entities/booking.entity';
import { TABLES } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { ERole } from 'src/common/enums/role.enum';
import { Venue } from 'src/venue/entities/venue.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity(TABLES.user)
export default class User extends Base {
  @Column()
  username: string;

  @IsEmail()
  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  stripeCustomerId: string;

  @Column({
    type: 'enum',
    enum: ERole,
    default: ERole.User,
  })
  role: ERole;

  @OneToOne(() => Venue, (venue) => venue.user)
  @JoinColumn()
  venue: Venue;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
