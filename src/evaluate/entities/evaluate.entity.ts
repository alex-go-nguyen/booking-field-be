import { TABLE } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { Field } from 'src/field/entities/field.entity';
import User from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity(TABLE.Evaluate)
export class Evaluate extends Base {
  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.evaluates)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Field, (field) => field.evaluates)
  @JoinColumn()
  field: Field;

  @Column({ type: 'decimal', precision: 5, scale: 1, default: 0 })
  rate: number;
}
