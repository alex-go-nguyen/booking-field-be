import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from 'src/user/dto/create-user.input';
import { UserService } from 'src/user/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findOne(username);

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user._id, username: user.username };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }

  async signUp(createUserDto: CreateUserInput) {
    const user = await this.userService.create(createUserDto);

    return user;
  }
}
