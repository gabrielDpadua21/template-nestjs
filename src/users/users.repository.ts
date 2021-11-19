import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRole } from './enums/users-role.enum';
import { User } from './users.entity';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CredentialsDto } from '../auth/dtos/credentials.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FindUsersQueryDto } from './dtos/find-users-query.dto';

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

  async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
    const { email, password } = credentialsDto;
    const user = await this.findOne({ email, status: true });
    if (user && (await user.checkPassword(password))) return user;
    return null;
  }

  async findUsers(
    queryDto: FindUsersQueryDto,
  ): Promise<{ users: User[]; total: number }> {
    queryDto.status = queryDto.status ?? true;
    queryDto.page = queryDto.page ?? 1;
    queryDto.limit = queryDto.limit ?? 50;
    const { email, name, status, role } = queryDto;
    const query = this.createQueryBuilder('user');
    query.where('user.status = :status', { status });
    if (email) query.where('user.email ILIKE :email', { email: `%${email}%` });
    if (name) query.where('user.name ILIKE :name', { name: `%${name}%` });
    if (role) query.where('user.role = :role', { role });
    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select(['user.name', 'user.email', 'user.role', 'user.status']);
    const [users, total] = await query.getManyAndCount();
    return { users, total };
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.findOne(userId, {
      select: ['email', 'name', 'role', 'id'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(
    user: User,
    { name, email, role, status }: UpdateUserDto,
  ): Promise<User> {
    user.email = email ?? user.email;
    user.name = name ?? user.name;
    user.role = role ?? user.role;
    user.status = status ?? user.status;
    try {
      await user.save();
      return user;
    } catch (err) {
      throw new InternalServerErrorException('Error to save data');
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.delete({ id });
    if (result.affected === 0) throw new NotFoundException('User not found');
    return true;
  }
}
