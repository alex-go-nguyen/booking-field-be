import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePitchCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  thumbnail: string;
}
