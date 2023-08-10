import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderEnum } from '../enums/order.enum';

export class ISortQuery {
  @ApiProperty()
  field: string;

  @ApiProperty({ enum: OrderEnum })
  @IsEnum(OrderEnum)
  order: OrderEnum;
}
