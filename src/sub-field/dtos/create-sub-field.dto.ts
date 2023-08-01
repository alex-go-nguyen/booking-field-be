import { ApiProperty } from '@nestjs/swagger';

export class CreateSubFieldDto {
  @ApiProperty()
  no: number;

  @ApiProperty()
  category: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  field: number;
}
