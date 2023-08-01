import { ApiProperty } from '@nestjs/swagger';
import { ILocation } from '../interfaces/location.interface';

export class CreateFieldDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: ILocation })
  location: ILocation;

  @ApiProperty()
  province: string;

  @ApiProperty()
  district: string;

  @ApiProperty()
  openAt: string;

  @ApiProperty()
  closeAt: string;
}
