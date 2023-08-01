import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ERole } from 'src/common/enums/role.enum';
import User from './entities/user.entity';
import { CurrentUser } from './user.decorator';
import { UserService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.Admin)
  @ResponseMessage('Get list users successfully')
  @Get()
  async findAll() {
    const data = await this.userService.findAll();

    return { data };
  }

  @ApiOkResponse({
    description: 'Get profile successfully!',
    type: User,
  })
  @ResponseMessage('Get current user successfully')
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User) {
    return { data: user };
  }
}
