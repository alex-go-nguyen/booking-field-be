import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';
import { AnalystUserQuery } from './dtos/analyst-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserQuery } from './dtos/user-query.dto';
import User from './entities/user.entity';
import { CurrentUser } from './user.decorator';
import { UserService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  jwtService: any;
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    description: 'Get list users successfully!',
    type: [User],
  })
  @Roles(RoleEnum.Admin)
  @UseGuards(RoleGuard)
  @ResponseMessage('Get list users successfully')
  @Get()
  findAll(@Query() query: UserQuery) {
    return this.userService.findAllUsers(query);
  }

  @ResponseMessage('Get analyst users successfully')
  @Get('analyst')
  analystByMonth(@Query() query: AnalystUserQuery) {
    return this.userService.analystUserSignIn(query);
  }

  @ApiOkResponse({
    description: 'Get profile successfully!',
    type: User,
  })
  @ResponseMessage('Get current user successfully')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @ApiOkResponse({
    description: 'Get user successfully!',
    type: User,
  })
  @ResponseMessage('Get user successfully')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findById(id);
  }

  @ApiOkResponse({
    description: 'Update password successfully!',
    type: User,
  })
  @ResponseMessage('Update password successfully')
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @CurrentUser() user: User) {
    return this.userService.changePassword(user.id, changePasswordDto);
  }

  @ApiOkResponse({
    description: 'Update profile successfully!',
    type: User,
  })
  @ResponseMessage('Update profile successfully!')
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @HttpCode(204)
  @Roles(RoleEnum.Admin)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.userService.softDelete(id);
  }
}
