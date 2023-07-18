import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseData, SignInPayload } from './dto/signIn.payload';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import User from 'src/user/entities/user.entity';
import { BaseResponse } from 'src/common/dto/base.dto';
import { plainToClass } from 'class-transformer';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    description: 'Login successfully!',
    type: BaseResponse<AuthResponseData>,
  })
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @Post('login')
  signIn(@Body() signInDto: SignInPayload): Promise<BaseResponse<AuthResponseData>> {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @ApiOkResponse({
    description: 'Register successfully!',
    type: BaseResponse<User>,
  })
  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() registerDto: CreateUserDto) {
    return this.authService.signUp(plainToClass(CreateUserDto, registerDto, { excludeExtraneousValues: true }));
  }
}
