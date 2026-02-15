import { Test, TestingModule } from '@nestjs/testing';
import { GetBalanceUseCase } from '../usecase/get-balance.usecase';
import { BalanceRepository } from '../repository/balance.repository';

describe('GetBalanceUseCase', () => {
  let useCase: GetBalanceUseCase;
  let repository: jest.Mocked<BalanceRepository>;

  beforeEach(async () => {
    const mockRepository: jest.Mocked<BalanceRepository> = {
      getBalance: jest.fn().mockResolvedValue(1500),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetBalanceUseCase,
        {
          provide: BalanceRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get(GetBalanceUseCase);
    repository = module.get(BalanceRepository);
  });

  it('should return balance from repository', async () => {
    const userId = 'user-123';
    const result = await useCase.execute(userId);

    expect(repository.getBalance).toHaveBeenCalledTimes(1);
    expect(repository.getBalance).toHaveBeenCalledWith(userId);
    expect(result).toEqual({ balance: 1500 });
  });

  it('should return zero when repository returns 0', async () => {
    (repository.getBalance as jest.Mock).mockResolvedValue(0);

    const result = await useCase.execute('user-456');

    expect(result).toEqual({ balance: 0 });
  });
});
