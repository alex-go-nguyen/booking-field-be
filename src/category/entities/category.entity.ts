import { TABLE } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { FieldTypeEnum } from 'src/common/enums/field-type.enum';
import { SubField } from 'src/sub-field/entities/sub-field.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity(TABLE.Category)
export class Category extends Base {
  @Column()
  name: FieldTypeEnum;

  @Column()
  description: string;

  @Column()
  thumbnail: string;

  @OneToMany(() => SubField, (subField) => subField.category)
  subFields: SubField[];
}
