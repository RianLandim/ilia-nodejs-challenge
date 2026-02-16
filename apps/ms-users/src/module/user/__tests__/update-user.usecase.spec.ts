import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserUseCase } from '../usecase/update-user.usecase';
import { UserRepository } from '../repository/user.repository';
import { UpdateUserDto } from '../dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('newHashedPassword'),
}));

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  let repository: jest.Mocked<UserRepository>;

  const updateDto: UpdateUserDto = {
    first_name: 'Jane',
    last_name: 'Smith',
  };

  const updatedUser = {
    id: 'user-123',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'john@example.com',
    password: 'hashedPassword',
  };

  beforeEach(async () => {
    const mockRepository: Partial<jest.Mocked<UserRepository>> = {
      update: jest.fn().mockResolvedValue(updatedUser),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: UserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get(UpdateUserUseCase);
    repository = module.get(UserRepository);

    jest.clearAllMocks();
  });

  it('should update user without password', async () => {
    const result = await useCase.execute('user-123', updateDto);

    expect(repository.update).toHaveBeenCalledWith('user-123', {
      firstName: 'Jane',
      lastName: 'Smith',
    });
    expect(result).toEqual({
      id: 'user-123',
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'john@example.com',
    });
    expect(result).not.toHaveProperty('password');
  });

  it('should hash password if provided', async () => {
    const dtoWithPassword: UpdateUserDto = {
      ...updateDto,
      password: 'newPassword123',
    };

    await useCase.execute('user-123', dtoWithPassword);

    expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
    expect(repository.update).toHaveBeenCalledWith('user-123', {
      firstName: 'Jane',
      lastName: 'Smith',
      password: 'newHashedPassword',
    });
  });

  it('should throw NotFoundException if user not found', async () => {
    repository.update.mockResolvedValueOnce(null);

    await expect(useCase.execute('non-existent', updateDto)).rejects.toThrow(
      NotFoundException,
    );
  });
});
