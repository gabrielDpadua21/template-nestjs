import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRole } from './enums/users-role.enum';
import { User } from './users.entity';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(
    createUserDto: CreateUserDto,
    role: UserRole,
  ): Promise<User> {
    const { email, name, password } = createUserDto;
    const user = this.create();
    user.email = email;
    user.name = name;
    user.role = role;
    user.status = true;
    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);
    try {
      await user.save();
      delete user.password;
      delete user.salt;
      delete user.createdAt;
      delete user.updatedAt;
      delete user.deletedAt;
      return user;
    } catch (err) {
      if (err.code.toString() === '23505')
        throw new ConflictException('E-mail address is used');
      throw new InternalServerErrorException('Error to save data in database');
    }
  }
}
