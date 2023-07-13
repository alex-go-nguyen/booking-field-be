import { IsEmail, MinLength } from 'class-validator';

export class CreateUserInput {
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  phone: string;
}
