import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Base } from 'src/common/entities/base.entity';
import { Role } from 'src/common/enums/role.enum';
import { Column, Entity } from 'typeorm';

@Entity()
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
    enum: Role,
    array: true,
    default: [Role.User],
  })
  roles: Role[];
}
