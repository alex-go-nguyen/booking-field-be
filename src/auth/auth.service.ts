import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user._id, username: user.username };

    const accessToken = this.jwtService.sign(payload);

    user.password = undefined;

    return {
      status: HttpStatus.OK,
      message: 'Login successfully',
      data: {
        accessToken,
        user,
      },
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    const payload = { sub: user._id, username: user.username };

    const accessToken = this.jwtService.sign(payload);

    user.password = undefined;

    return {
      status: HttpStatus.CREATED,
      message: 'Register account successfully',
      data: {
        accessToken,
        user,
      },
    };
  }
}
