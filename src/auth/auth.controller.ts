import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { BaseResponse } from 'src/common/dtos/base.dto';
import { ForgottenPasswordService } from 'src/forgotten-password/forgotten-password.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import User from 'src/user/entities/user.entity';
import { UserService } from 'src/user/users.service';
import { AuthService } from './auth.service';
import { AuthResponseData } from './dtos/auth.response.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { SignInPayload } from './dtos/signIn.payload';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly forgottenPasswordService: ForgottenPasswordService,
  ) {}

  @ApiOkResponse({
    description: 'Login successfully!',
    type: BaseResponse<AuthResponseData>,
  })
  @ResponseMessage('Login successfully')
  @Post('login')
  async signIn(@Body() signInDto: SignInPayload) {
    const { username, password } = signInDto;

    const data = await this.authService.signIn(username, password);

    return { data };
  }

  @ApiOkResponse({
    description: 'Register successfully!',
    type: BaseResponse<User>,
  })
  @ResponseMessage('Register successfully')
  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
    const data = await this.authService.signUp(registerDto);

    return { data };
  }

  @Post('email/reset-password')
  @HttpCode(HttpStatus.OK)
  async setNewPassword(@Body() { newPassword, resetToken }: ResetPasswordDto) {
    const forgottenPassword = await this.forgottenPasswordService.getForgottenPasswordModel(resetToken);

    const data = await this.userService.setPassword(forgottenPassword.email, newPassword);

    if (data) {
      await this.forgottenPasswordService.remove(forgottenPassword);
    }

    return { data };
  }

  @ApiOkResponse({
    description: 'Update password successfully!',
    type: User,
  })
  @ResponseMessage('Update password successfully')
  @Post('forgot-password/:email')
  async sendEmailForgotPassword(@Param('email') email: string) {
    const data = await this.authService.sendEmailForgotPassword(email);

    return { data };
  }
}
