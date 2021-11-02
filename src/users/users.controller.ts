import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ValidationTypes } from 'class-validator';
import { CreateUserDto } from './dtos/create-user.dto';
import { ResponseDto } from './dtos/response-dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // @Post()
  // async create(
  //   @Body(ValidationPipe) createUserDto: CreateUserDto,
  // ): Promise<ResponseDto> {
  //   const user = await this.userService.create(createUserDto);
  //   return new ResponseDto(user, 'Successs');
  // }

  @Post('/admin')
  async createAdmin(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ResponseDto> {
    const user = await this.userService.createAdmin(createUserDto);
    return new ResponseDto(user, 'Successs');
  }
}
