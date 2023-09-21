import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Location } from '../interfaces/location.interface';

export class CreateVenueDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional({ type: Location })
  @IsOptional()
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

  @ApiProperty()
  @IsInt()
  user: number;
}
