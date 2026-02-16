import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionUseCase } from '../usecase/create-transaction.usecase';
import { TransactionRepository } from '../repository/transaction.repository';
import { CreateTransactionDto } from '../dto';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let repository: jest.Mocked<TransactionRepository>;

  const validDto: CreateTransactionDto = {
    userId: 'user-123',
    amount: 100,
    type: 'CREDIT',
  };

  beforeEach(async () => {
    const mockRepository: jest.Mocked<TransactionRepository> = {
      createTransacation: jest.fn().mockResolvedValue(undefined),
      findByUserId: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        {
          provide: TransactionRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get(CreateTransactionUseCase);
    repository = module.get(TransactionRepository);
  });

  it('should create a transaction by calling the repository with the correct data', async () => {
    await useCase.execute(validDto);

    expect(repository.createTransacation).toHaveBeenCalledTimes(1);
    expect(repository.createTransacation).toHaveBeenCalledWith(validDto);
  });

  it('should create a DEBIT transaction', async () => {
    const debitDto: CreateTransactionDto = {
      userId: 'user-456',
      amount: 50,
      type: 'DEBIT',
    };

    await useCase.execute(debitDto);

    expect(repository.createTransacation).toHaveBeenCalledWith(debitDto);
  });

  it('should return the repository result', async () => {
    const result = await useCase.execute(validDto);

    expect(result).toBeUndefined();
  });
});
