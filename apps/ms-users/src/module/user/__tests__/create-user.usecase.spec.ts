import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { CreateUserUseCase } from '../usecase/create-user.usecase';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let repository: jest.Mocked<UserRepository>;

  const validDto: CreateUserDto = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    const mockRepository: Partial<jest.Mocked<UserRepository>> = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        id: 'user-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: UserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get(CreateUserUseCase);
    repository = module.get(UserRepository);

    jest.clearAllMocks();
  });

  it('should create a user with hashed password', async () => {
    const result = await useCase.execute(validDto);

    expect(repository.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(repository.create).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
    });
    expect(result).toEqual({
      id: 'user-123',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
    });
    expect(result).not.toHaveProperty('password');
  });

  it('should throw ConflictException if email already exists', async () => {
    repository.findByEmail.mockResolvedValueOnce({
      id: 'existing-user',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'hashedPassword',
    });

    await expect(useCase.execute(validDto)).rejects.toThrow(ConflictException);
    expect(repository.create).not.toHaveBeenCalled();
  });
});
