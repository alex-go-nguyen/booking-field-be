import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { OrderEnum } from '../enums/order.enum';

export class IPagination {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(OrderEnum)
  order: OrderEnum;
}
