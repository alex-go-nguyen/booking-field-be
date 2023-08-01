import { Booking } from 'src/booking/entities/booking.entity';
import { Category } from 'src/category/entities/category.entity';
import { TABLE } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { Field } from 'src/field/entities/field.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity(TABLE.SubField)
export class SubField extends Base {
  @Column()
  no: number;

  @ManyToOne(() => Category, (category) => category.subFields)
  @JoinColumn()
  category: Category;

  @Column()
  price: number;

  @ManyToOne(() => Field, (field) => field.subFields)
  @JoinColumn()
  field: Field;

  @OneToMany(() => Booking, (booking) => booking.subField)
  bookings: Booking[];
}
