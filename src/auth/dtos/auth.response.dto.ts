import { ApiProperty } from '@nestjs/swagger';
import User from 'src/user/entities/user.entity';

export class AuthResponseData {
  @ApiProperty({
    type: User,
  })
  user: User;

  @ApiProperty({
    type: 'string',
    example: 'token',
  })
  accessToken: string;
}
