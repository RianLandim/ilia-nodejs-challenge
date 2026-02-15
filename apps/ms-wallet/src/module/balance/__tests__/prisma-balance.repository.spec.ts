import { Test, TestingModule } from '@nestjs/testing';
import { PrismaBalanceRepository } from '../repository/prisma-balance.repository';
import { DatabaseService } from 'src/config/database.config';

describe('PrismaBalanceRepository', () => {
  let repository: PrismaBalanceRepository;
  let databaseService: jest.Mocked<DatabaseService>;

  beforeEach(async () => {
    const mockDatabaseService = {
      transaction: {
        aggregate: jest.fn(),
      },
    } as unknown as jest.Mocked<DatabaseService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaBalanceRepository,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    repository = module.get(PrismaBalanceRepository);
    databaseService = module.get(DatabaseService);
  });

  it('should return balance as credits minus debits', async () => {
    (databaseService.transaction.aggregate as jest.Mock)
      .mockResolvedValueOnce({ _sum: { amount: 5000 } })
      .mockResolvedValueOnce({ _sum: { amount: 1500 } });

    const result = await repository.getBalance('user-123');

    expect(databaseService.transaction.aggregate).toHaveBeenCalledTimes(2);
    expect(databaseService.transaction.aggregate).toHaveBeenNthCalledWith(1, {
      where: { userId: 'user-123', type: 'CREDIT' },
      _sum: { amount: true },
    });
    expect(databaseService.transaction.aggregate).toHaveBeenNthCalledWith(2, {
      where: { userId: 'user-123', type: 'DEBIT' },
      _sum: { amount: true },
    });
    expect(result).toBe(3500);
  });

  it('should return rounded balance', async () => {
    (databaseService.transaction.aggregate as jest.Mock)
      .mockResolvedValueOnce({ _sum: { amount: 1000.4 } })
      .mockResolvedValueOnce({ _sum: { amount: 200.3 } });

    const result = await repository.getBalance('user-456');

    expect(result).toBe(800);
  });

  it('should return 0 when no transactions', async () => {
    (databaseService.transaction.aggregate as jest.Mock)
      .mockResolvedValueOnce({ _sum: null })
      .mockResolvedValueOnce({ _sum: null });

    const result = await repository.getBalance('user-789');

    expect(result).toBe(0);
  });
});
