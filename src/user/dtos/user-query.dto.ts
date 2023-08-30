import { BaseQuery } from 'src/common/dtos/query.dto';
import { RoleEnum } from 'src/common/enums/role.enum';

export class UserQuery extends BaseQuery {
  role: RoleEnum;
}
