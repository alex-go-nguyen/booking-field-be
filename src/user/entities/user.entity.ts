import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Booking } from 'src/booking/entities/booking.entity';
import { TABLE } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { ERole } from 'src/common/enums/role.enum';
import { Evaluate } from 'src/evaluate/entities/evaluate.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity(TABLE.User)
export default class User extends Base {
  @ApiProperty()
  @Column()
  username: string;

  @ApiProperty()
  @IsEmail()
  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @ApiProperty()
  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: ERole,
    array: true,
    default: [ERole.User],
  })
  roles: ERole[];

  @OneToMany(() => Booking, (booking) => booking.user)
  booking: Booking[];

  @OneToMany(() => Evaluate, (evaluate) => evaluate.user)
  evaluates: Evaluate[];
}
