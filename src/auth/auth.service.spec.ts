import { Test, TestingModule } from '@nestjs/testing';
import { UnprocessableEntityException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRepository } from '../users/users.repository';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UserRole } from '../users/enums/users-role.enum';
import { User } from '../users/users.entity';
import { CredentialsDto } from './dtos/credentials.dto';
import { JwtService } from '@nestjs/jwt';

const mockUserRepository = () => ({
  createUser: jest.fn(),
  checkCredentials: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

describe('Users tests', () => {
  let service;
  let userRepository;
  let jwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should user service and repository be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('Sign Up', () => {
    let mockCreateUserDto: CreateUserDto;

    beforeEach(() => {
      mockCreateUserDto = new CreateUserDto(
        'mock@gmail.com',
        'mock',
        'mock@123',
        'mock@123',
      );
    });

    it('Should create an user if passwords match', async () => {
      userRepository.createUser.mockResolvedValue('mockUser');
      const user = await service.signUp(mockCreateUserDto);
      expect(userRepository.createUser).toHaveBeenCalledWith(
        mockCreateUserDto,
        UserRole.USER,
      );
      expect(user).toEqual('mockUser');
    });

    it('Should throw an error if password doesnt match', async () => {
      mockCreateUserDto.passwordConfirm = 'error';
      expect(service.signUp(mockCreateUserDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('Sign In', () => {
    let mockUser: User;
    let mockCredentials: CredentialsDto;

    beforeEach(() => {
      mockUser = new User();
      mockUser.id = '1';
      mockUser.email = 'mock@gmail.com';
      mockUser.password =
        '$2b$10$93qzyKFW3oTXyLBICllIbOINqtRAudzLDkSgf4PC3poZnN.4FdCxK';
      mockCredentials = new CredentialsDto('mock@gmail.com', '123mudar');
    });

    it('Should make sign in if password is correct', async () => {
      userRepository.checkCredentials.mockResolvedValue(mockUser);
      jwtService.sign.mockResolvedValue('kjdoiweiwdoijadiasd');
      const { token } = await service.signIn(mockCredentials);
      expect(userRepository.checkCredentials).toHaveBeenCalledWith(
        mockCredentials,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({ id: mockUser.id });
      expect(token).toEqual('kjdoiweiwdoijadiasd');
    });
  });
});
