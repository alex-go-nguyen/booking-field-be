import { ApiProperty } from '@nestjs/swagger';
import { FieldTypeEnum } from 'src/common/enums/field-type.enum';

export class CreateCategoryDto {
  @ApiProperty()
  name: FieldTypeEnum;
}
