import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TransactionGrpcController } from '../transaction-grpc.controller';
import { ListTransactionsByUserUseCase } from '../usecase/list-transactions-by-user.usecase';
import { TransactionRepository } from '../repository/transaction.repository';
import { GrpcInternalAuthGuard } from 'src/common/guards/grpc-internal-auth.guard';

describe('TransactionGrpcController', () => {
  let controller: TransactionGrpcController;
  let mockFindByUserId: jest.Mock;

  beforeEach(async () => {
    mockFindByUserId = jest.fn().mockResolvedValue([
      {
        id: 'tx-1',
        userId: 'user-123',
        type: 'CREDIT' as const,
        amount: 100,
      },
      {
        id: 'tx-2',
        userId: 'user-123',
        type: 'DEBIT' as const,
        amount: 50,
      },
    ]);

    const mockRepository: Partial<TransactionRepository> = {
      findByUserId: mockFindByUserId,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionGrpcController],
      providers: [
        ListTransactionsByUserUseCase,
        {
          provide: TransactionRepository,
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: { getOrThrow: jest.fn().mockReturnValue('test-secret') },
        },
        GrpcInternalAuthGuard,
      ],
    }).compile();

    controller = module.get(TransactionGrpcController);
  });

  it('should return transactions mapped with enum type values', async () => {
    const result = await controller.findAllTransactions({
      userId: 'user-123',
    });

    expect(result).toEqual({
      transactions: [
        { id: 'tx-1', userId: 'user-123', amount: 100, type: 0 },
        { id: 'tx-2', userId: 'user-123', amount: 50, type: 1 },
      ],
    });
    expect(mockFindByUserId).toHaveBeenCalledWith('user-123', {
      type: undefined,
    });
  });

  it('should filter by type when provided', async () => {
    mockFindByUserId.mockResolvedValueOnce([
      {
        id: 'tx-1',
        userId: 'user-123',
        type: 'CREDIT' as const,
        amount: 100,
      },
    ]);

    const result = await controller.findAllTransactions({
      userId: 'user-123',
      type: 0,
    });

    expect(result).toEqual({
      transactions: [
        { id: 'tx-1', userId: 'user-123', amount: 100, type: 0 },
      ],
    });
    expect(mockFindByUserId).toHaveBeenCalledWith('user-123', {
      type: 'CREDIT',
    });
  });

  it('should return empty transactions list', async () => {
    mockFindByUserId.mockResolvedValueOnce([]);

    const result = await controller.findAllTransactions({
      userId: 'user-456',
    });

    expect(result).toEqual({ transactions: [] });
  });
});
