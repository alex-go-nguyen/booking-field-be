import { ApiProperty } from '@nestjs/swagger';

export class VenueImage {
  @ApiProperty()
  imagePath: string;
}
