import { BaseQueryParamsDto } from '../../shared/dto/base-query-params.dto';

export class FindUsersQueryDto extends BaseQueryParamsDto {
  name?: string;
  email?: string;
  status?: boolean;
  role?: string;

  constructor(name?: string, email?: string, status?: boolean, role?: string) {
    super();
    this.name = name;
    this.email = email;
    this.status = status;
    this.role = role;
  }
}
