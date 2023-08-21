import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserInfoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  firstName: string;

  @ApiPropertyOptional()
  @IsOptional()
  lastName: string;

  @ApiPropertyOptional()
  @IsOptional()
  phone: string;
}
