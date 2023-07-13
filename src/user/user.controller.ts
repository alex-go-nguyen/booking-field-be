import { Controller, Get, Request } from '@nestjs/common';
import { Public } from 'src/common/constants/key';

@Controller('user')
export class UserController {
  @Public()
  @Get()
  findAll() {
    return [];
  }

  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
