import * as bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';
import { Booking } from 'src/booking/entities/booking.entity';
import { TABLES } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Notification } from 'src/notification/entities/notification.entity';
import { Tournament } from 'src/tournament/entities/tournament.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { BeforeInsert, Column, Entity, OneToMany, OneToOne } from 'typeorm';

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

  @Column({ nullable: true })
  stripeCustomerId: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.User,
  })
  role: RoleEnum;

  @OneToOne(() => Venue, (venue) => venue.user, { nullable: true })
  venue: Venue;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Tournament, (tournament) => tournament.user)
  tournaments: Tournament[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
