import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRole } from './enums/users-role.enum';
import { UnprocessableEntityException } from '@nestjs/common';

const mockUserRepository = () => ({
  createUser: jest.fn(),
});

describe('Users tests', () => {
  let service;
  let userRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should user service and repository be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('Create user', () => {
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
      const user = await service.create(mockCreateUserDto);
      expect(userRepository.createUser).toHaveBeenCalledWith(
        mockCreateUserDto,
        UserRole.USER,
      );
      expect(user).toEqual('mockUser');
    });

    it('Should create an admin user if password match', async () => {
      userRepository.createUser.mockResolvedValue('mockAdminUser');
      const adminUser = await service.createAdmin(mockCreateUserDto);
      expect(userRepository.createUser).toHaveBeenCalledWith(
        mockCreateUserDto,
        UserRole.ADMIN,
      );
      expect(adminUser).toEqual('mockAdminUser');
    });

    it('Should throw an error if password doesnt match', async () => {
      mockCreateUserDto.passwordConfirm = 'error';
      expect(service.create(mockCreateUserDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('Should throw an error if password doesnt match when create admin', async () => {
      mockCreateUserDto.passwordConfirm = 'error';
      expect(service.createAdmin(mockCreateUserDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });
});
