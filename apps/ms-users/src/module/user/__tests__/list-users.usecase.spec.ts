import { Test, TestingModule } from '@nestjs/testing';
import { ListUsersUseCase } from '../usecase/list-users.usecase';
import { UserRepository } from '../repository/user.repository';

describe('ListUsersUseCase', () => {
  let useCase: ListUsersUseCase;
  let repository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const mockRepository: Partial<jest.Mocked<UserRepository>> = {
      findAll: jest.fn().mockResolvedValue([
        {
          id: 'user-1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'hashedPassword',
        },
        {
          id: 'user-2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          password: 'hashedPassword',
        },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListUsersUseCase,
        {
          provide: UserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get(ListUsersUseCase);
    repository = module.get(UserRepository);
  });

  it('should return list of users without password', async () => {
    const result = await useCase.execute();

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([
      {
        id: 'user-1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
      },
      {
        id: 'user-2',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
      },
    ]);
    result.forEach((user) => {
      expect(user).not.toHaveProperty('password');
    });
  });
});
