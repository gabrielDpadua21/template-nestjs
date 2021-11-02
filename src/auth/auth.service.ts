import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UserRole } from '../users/enums/users-role.enum';
import { User } from '../users/users.entity';
import { UserRepository } from '../users/users.repository';
import { CredentialsDto } from './dtos/credentials.dto';
import { ResponseSignDto } from './dtos/response-sign.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password !== createUserDto.passwordConfirm)
      throw new UnprocessableEntityException('password is not equal');
    return this.userRepository.createUser(createUserDto, UserRole.USER);
  }

  async signIn(credentialDto: CredentialsDto): Promise<any> {
    const user = await this.userRepository.checkCredentials(credentialDto);
    if (user === null) throw new UnauthorizedException('Invalid creadentials');
    const token = await this.jwtService.sign(this.generateJwtPayload(user));
    return new ResponseSignDto(token, null);
  }

  private generateJwtPayload(user: User): { id: string } {
    return { id: user.id };
  }
}
