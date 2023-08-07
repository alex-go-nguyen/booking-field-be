import { ApiProperty } from '@nestjs/swagger';

export class VenueSearchBody {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  province: string;
  @ApiProperty()
  district: string;
}

export interface VenueSearchResult {
  hits: {
    total: number;
    hits: Array<{ _source: VenueSearchBody }>;
  };
}
