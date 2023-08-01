import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @ApiProperty()
  firstName: string;

  @Expose()
  @ApiProperty()
  lastName: string;

  @ApiProperty()
  @Expose()
  @MinLength(6)
  password: string;

  @Expose()
  @ApiProperty()
  phone: string;
}
