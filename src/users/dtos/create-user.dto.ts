import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsEmail(
    {},
    {
      message: 'Invalid email',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'name is required',
  })
  name: string;

  @IsNotEmpty({
    message: 'password is required',
  })
  @MinLength(6, {
    message: 'The password must be at least six chararacters',
  })
  password: string;

  @IsNotEmpty({
    message: 'password confirm is required',
  })
  @MinLength(6, {
    message: 'The password confirm must be at least six chararacters',
  })
  passwordConfirm: string;

  constructor(
    email: string,
    name: string,
    password: string,
    confirmPassword: string,
  ) {
    this.email = email;
    this.name = name;
    this.password = password;
    this.passwordConfirm = confirmPassword;
  }
}
