import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetUserUseCase } from '../usecase/get-user.usecase';
import { UserRepository } from '../repository/user.repository';

describe('GetUserUseCase', () => {
  let useCase: GetUserUseCase;
  let repository: jest.Mocked<UserRepository>;

  const mockUser = {
    id: 'user-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
  };

  beforeEach(async () => {
    const mockRepository: Partial<jest.Mocked<UserRepository>> = {
      findById: jest.fn().mockResolvedValue(mockUser),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserUseCase,
        {
          provide: UserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get(GetUserUseCase);
    repository = module.get(UserRepository);
  });

  it('should return user by id without password', async () => {
    const result = await useCase.execute('user-123');

    expect(repository.findById).toHaveBeenCalledWith('user-123');
    expect(result).toEqual({
      id: 'user-123',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
    });
    expect(result).not.toHaveProperty('password');
  });

  it('should throw NotFoundException if user not found', async () => {
    repository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute('non-existent')).rejects.toThrow(
      NotFoundException,
    );
  });
});
