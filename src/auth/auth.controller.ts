import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { BaseResponse } from 'src/common/dtos/base.dto';
import { ERole } from 'src/common/enums/role.enum';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import User from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthResponseData } from './dtos/auth.response.dto';
import { SignInPayload } from './dtos/signIn.payload';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    description: 'Login successfully!',
    type: BaseResponse<AuthResponseData>,
  })
  @Roles(ERole.Admin)
  @ResponseMessage('Login successfully')
  @Post('login')
  async signIn(@Body() signInDto: SignInPayload) {
    const data = await this.authService.signIn(signInDto.username, signInDto.password);

    return { data };
  }

  @ApiOkResponse({
    description: 'Register successfully!',
    type: BaseResponse<User>,
  })
  @ResponseMessage('Register successfully')
  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
    const data = await this.authService.signUp(
      plainToClass(CreateUserDto, registerDto, { excludeExtraneousValues: true }),
    );

    return { data };
  }
}
