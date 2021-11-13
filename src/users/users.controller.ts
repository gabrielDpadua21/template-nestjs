import {
  Body,
  Controller,
  Post,
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

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/admin')
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async createAdmin(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<ResponseDto> {
    const user = await this.userService.createAdmin(createUserDto);
    return new ResponseDto(user, 'Successs');
  }
}
