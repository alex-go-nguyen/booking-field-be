import * as bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';
import { Booking } from 'src/booking/entities/booking.entity';
import { Base } from 'src/common/entities/base.entity';
import { ERole } from 'src/common/enums/role.enum';
import { TABLE } from 'src/common/enums/table.enum';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';

@Entity(TABLE.User)
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

  @Column({
    type: 'enum',
    enum: ERole,
    default: ERole.User,
  })
  role: ERole;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
