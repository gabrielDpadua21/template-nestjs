import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRole } from './enums/users-role.enum';
import { User } from './users.entity';
import { UserRepository } from './users.repository';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FindUsersQueryDto } from './dtos/find-users-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createAdmin(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password !== createUserDto.passwordConfirm)
      throw new UnprocessableEntityException('password is not equal');
    return this.userRepository.createUser(createUserDto, UserRole.ADMIN);
  }

  async findUserById(userId: string): Promise<User> {
    return await this.userRepository.findUserById(userId);
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findUserById(userId);
    return await this.userRepository.updateUser(user, updateUserDto);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.userRepository.deleteUser(id);
  }

  async findUsers(
    queryUserDto: FindUsersQueryDto,
  ): Promise<{ users: User[]; total: number }> {
    return await this.userRepository.findUsers(queryUserDto);
  }
}
