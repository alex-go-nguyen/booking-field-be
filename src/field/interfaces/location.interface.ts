import { ApiProperty } from '@nestjs/swagger';

export class ILocation {
  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;
}
