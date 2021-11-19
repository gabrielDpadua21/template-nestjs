import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRole } from './enums/users-role.enum';
import { UnprocessableEntityException } from '@nestjs/common';
import { User } from './users.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

const mockUserRepository = () => ({
  createUser: jest.fn(),
  findUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
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

    it('Should create an admin user if password match', async () => {
      userRepository.createUser.mockResolvedValue('mockAdminUser');
      const adminUser = await service.createAdmin(mockCreateUserDto);
      expect(userRepository.createUser).toHaveBeenCalledWith(
        mockCreateUserDto,
        UserRole.ADMIN,
      );
      expect(adminUser).toEqual('mockAdminUser');
    });

    it('Should throw an error if password doesnt match when create admin', async () => {
      mockCreateUserDto.passwordConfirm = 'error';
      expect(service.createAdmin(mockCreateUserDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('Find user by id', () => {
    let mockUser: User;

    beforeEach(() => {
      mockUser = new User();
      mockUser.id = '1';
    });

    it('Should return user when is is valid', async () => {
      userRepository.findUserById.mockResolvedValue(mockUser);
      const user = await service.findUserById('1');
      expect(user.id).toBe('1');
    });
  });

  describe('Update user', () => {
    let mockUserUpdateDto: UpdateUserDto;
    let mockUser: User;

    beforeEach(() => {
      mockUserUpdateDto = new UpdateUserDto(
        'mock',
        'mock@gmail.com',
        UserRole.ADMIN,
        true,
      );
      mockUser = new User();
      mockUser.id = '1';
    });

    it('Should update user', async () => {
      userRepository.findUserById.mockResolvedValue(mockUser);
      expect(mockUser.id).toBe('1');
      userRepository.updateUser.mockResolvedValue('mockUpdateUser');
      const user = await service.updateUser('1', mockUserUpdateDto);
      expect(user).toBe('mockUpdateUser');
    });
  });

  describe('Delete user', () => {
    let mockUser: User;

    beforeEach(() => {
      mockUser = new User();
      mockUser.id = '1';
    });

    it('should delete user if exists', async () => {
      userRepository.deleteUser.mockResolvedValue(true);
      const result = await service.deleteUser('1');
      expect(userRepository.deleteUser).toBeCalledWith('1');
      expect(result).toBeTruthy();
    });
  });
});
