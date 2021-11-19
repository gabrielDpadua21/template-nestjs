import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dtos/create-user.dto';
import { ResponseDto } from './dtos/response-dto';
import { UserRole } from './enums/users-role.enum';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from 'src/auth/role.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';
import { GetUser } from 'src/auth/get-user.docorator';
import { User } from './users.entity';
import { FindUsersQueryDto } from './dtos/find-users-query.dto';

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/admin')
  @Role(UserRole.ADMIN)
  async createAdmin(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ResponseDto> {
    const user = await this.userService.createAdmin(createUserDto);
    return new ResponseDto(user, 'Successs');
  }

  @Get(':id')
  @Role(UserRole.ADMIN)
  async findUserById(@Param('id') id: string): Promise<ResponseDto> {
    const user = await this.userService.findUserById(id);
    return new ResponseDto(user, 'User Found');
  }

  @Get()
  @Role(UserRole.ADMIN)
  async findUsers(
    @Body() findUsersQueryDto: FindUsersQueryDto,
  ): Promise<ResponseDto> {
    const users = await this.userService.findUsers(findUsersQueryDto);
    return new ResponseDto(users, 'Success');
  }

  @Put(':id')
  @Role(UserRole.ADMIN)
  async updateUser(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() reqUser: User,
    @Param('id') id: string,
  ): Promise<ResponseDto> {
    if (reqUser.id !== id)
      throw new ForbiddenException('You dont have permission for this action');
    const user = await this.userService.updateUser(id, updateUserDto);
    return new ResponseDto(user, 'Success');
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  async deleteUser(
    @GetUser() reqUser: User,
    @Param('id') id: string,
  ): Promise<ResponseDto> {
    if (reqUser.id === id)
      throw new ForbiddenException('You cant delete your user');
    const result = await this.userService.deleteUser(id);
    return new ResponseDto(result, 'Sucess');
  }
}
