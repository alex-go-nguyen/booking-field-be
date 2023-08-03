import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import User from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './users.service';
import { CurrentUser } from './user.decorator';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return [];
  }

  @ApiOkResponse({
    description: 'Get profile successfully!',
    type: User,
  })
  @Get('me')
  @UseGuards(AuthGuard)
  getProfile(@CurrentUser() user: User) {
    return user;
  }
}
