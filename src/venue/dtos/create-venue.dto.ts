import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Location } from '../interfaces/location.interface';

export class CreateVenueDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: Location })
  location: Location;

  @ApiProperty()
  @IsString()
  province: string;

  @ApiProperty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsString()
  openAt: string;

  @ApiProperty()
  @IsString()
  closeAt: string;
}
