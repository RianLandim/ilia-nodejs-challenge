import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserUseCase } from '../usecase/delete-user.usecase';
import { UserRepository } from '../repository/user.repository';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
  let repository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const mockRepository: Partial<jest.Mocked<UserRepository>> = {
      delete: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: UserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get(DeleteUserUseCase);
    repository = module.get(UserRepository);
  });

  it('should delete user by id', async () => {
    await useCase.execute('user-123');

    expect(repository.delete).toHaveBeenCalledWith('user-123');
    expect(repository.delete).toHaveBeenCalledTimes(1);
  });
});
