import { ApiProperty } from '@nestjs/swagger';

export class IFieldImage {
  @ApiProperty()
  imagePath: string;
}
