import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse<T> {
  @ApiProperty()
  status: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: T;
}

export class PageInfoData {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  pageCount: number;

  @ApiProperty()
  count: number;
}

export class BasePaginationResponse<T> {
  @ApiProperty()
  status: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: T;

  @ApiProperty()
  pageInfo: PageInfoData;
}
