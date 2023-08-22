import { ApiProperty } from '@nestjs/swagger';

export class Location {
  @ApiProperty()
  lat: number;

  @ApiProperty()
  lng: number;
}
