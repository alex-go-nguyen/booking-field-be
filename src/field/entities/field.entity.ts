import { TABLE } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { strToSlug } from 'src/common/utils';
import { Evaluate } from 'src/evaluate/entities/evaluate.entity';
import { SubField } from 'src/sub-field/entities/sub-field.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { IFieldImage } from '../interfaces/field-image.interface';
import { ILocation } from '../interfaces/location.interface';

@Entity(TABLE.Field)
export class Field extends Base {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column('jsonb')
  location: ILocation;

  @Column()
  address: string;

  @Column()
  province: string;

  @Column()
  district: string;

  @Column({ type: 'decimal', precision: 5, scale: 1, default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalReview: number;

  @Column('jsonb', { nullable: true })
  imageList: IFieldImage[];

  @Column({ type: 'time' })
  openAt: string;

  @Column({ type: 'time' })
  closeAt: string;

  @Column({ type: 'text', nullable: false })
  slug: string;

  @OneToMany(() => SubField, (subField) => subField.field)
  subFields: SubField[];

  @OneToMany(() => Evaluate, (evaluate) => evaluate.field)
  evaluates: Evaluate[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = strToSlug(this.name);
  }
}
