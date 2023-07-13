import { IsEmail } from 'class-validator';
import { Base } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export default class User extends Base {
  @Column()
  username: string;

  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;
}
