import * as bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';
import { Booking } from 'src/booking/entities/booking.entity';
import { TABLES } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { RoleEnum } from 'src/common/enums/role.enum';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';

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
    enum: RoleEnum,
    default: RoleEnum.User,
  })
  role: RoleEnum;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
