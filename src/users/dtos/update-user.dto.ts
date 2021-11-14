import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../enums/users-role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString({
    message: 'User name invalid',
  })
  name: string;
  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'Mail address invalid',
    },
  )
  email: string;
  @IsOptional()
  role: UserRole;
  @IsOptional()
  status: boolean;

  constructor(email: string, name: string, role: UserRole, status: boolean) {
    this.email = email;
    this.name = name;
    this.role = role;
    this.status = status;
  }
}
