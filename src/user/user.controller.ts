import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';
import { AnalystUserQuery } from './dtos/analyst-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { UpdateUserDto } from './dtos/update-info-user.dto';
import { UserQuery } from './dtos/user-query.dto';
import User from './entities/user.entity';
import { CurrentUser } from './user.decorator';
import { UserService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UserController {
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
    const { role } = query;

    return this.userService.findAndCount(query, {
      where: {
        role,
      },
    });
  }

  @ResponseMessage('Get analyst users successfully')
  @Get('analyst')
  async analystByMonth(@Query() query: AnalystUserQuery) {
    const data = await this.userService.analystUserSignIn(query);

    return { data };
  }

  @ApiOkResponse({
    description: 'Get user successfully!',
    type: User,
  })
  @ResponseMessage('Get user successfully')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.userService.findOne({
      where: {
        id,
      },
    });

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

  @ApiOkResponse({
    description: 'Update password successfully!',
    type: User,
  })
  @ResponseMessage('Update password successfully')
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @CurrentUser('id') userId: number) {
    const data = await this.userService.changePassword(userId, changePasswordDto);
    return { data };
  }

  @ApiOkResponse({
    description: 'Update profile successfully!',
    type: User,
  })
  @ResponseMessage('Update profile successfully!')
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.userService.update(id, updateUserDto);
    return { data };
  }

  @HttpCode(204)
  @Roles(RoleEnum.Admin)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    this.userService.softDelete(id);
  }
}
