import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { ForgottenPasswordService } from 'src/forgotten-password/forgotten-password.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { UserService } from 'src/user/users.service';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class AuthService {
  private expiredTime = 12 * 60 * 60 * 1000;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly forgottenPasswordService: ForgottenPasswordService,
  ) {}

  async handleVerifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      const user = await this.userService.findOne({
        where: {
          id: payload.sub,
        },
      });

      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async signIn(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);
    user.password = undefined;
    return {
      accessToken,
      user,
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    const payload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);
    user.password = undefined;

    return {
      accessToken,
      user,
    };
  }

  async resetPassword({ newPassword, resetToken }: ResetPasswordDto) {
    const forgottenPassword = await this.forgottenPasswordService.getForgottenPasswordModel(resetToken);

    const data = await this.userService.setPassword(forgottenPassword.email, newPassword);

    if (data) {
      await this.forgottenPasswordService.remove(forgottenPassword);
    }

    return data;
  }

  async createForgottenPasswordToken(email: string) {
    const forgottenPassword = await this.forgottenPasswordService.findOne({
      where: {
        email,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (forgottenPassword && new Date().getTime() < forgottenPassword.expiredAt.getTime()) {
      this.forgottenPasswordService.update(forgottenPassword.id, { expiredAt: new Date() });
    }

    const resetToken = (Math.floor(Math.random() * 9000000) + 1000000).toString();

    return this.forgottenPasswordService.create({
      email,
      resetToken,
      expiredAt: new Date(new Date().getTime() + this.expiredTime),
    });
  }

  async sendEmailForgotPassword(email: string) {
    const isValidEmail = await this.userService.findOne({
      where: {
        email,
      },
    });
    if (!isValidEmail) {
      throw new NotFoundException('Invalid email');
    }

    const { resetToken } = await this.createForgottenPasswordToken(email);

    return this.mailerService.sendMail({
      from: this.configService.get<string>('MAILER_USER'),
      to: email,
      subject: 'Forgotten Password',
      template: 'resetPassword',
      context: {
        user: isValidEmail,
        resetLink: `${this.configService.get('CLIENT_URL')}/reset-password/${resetToken}`,
      },
    });
  }
}
