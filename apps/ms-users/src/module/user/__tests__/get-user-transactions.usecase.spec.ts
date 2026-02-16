import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { GetUserTransactionsUseCase } from '../usecase/get-user-transactions.usecase';
import { GRPC_WALLET_CLIENT } from '@ilia/grpc';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('internal-jwt-token'),
}));

describe('GetUserTransactionsUseCase', () => {
  let useCase: GetUserTransactionsUseCase;
  let mockFindAllTransactions: jest.Mock;

  beforeEach(async () => {
    mockFindAllTransactions = jest.fn().mockReturnValue(
      of({
        transactions: [
          { id: 'tx-1', userId: 'user-123', amount: 100, type: 0 },
          { id: 'tx-2', userId: 'user-123', amount: 50, type: 1 },
        ],
      }),
    );

    const mockGrpcClient = {
      getService: jest.fn().mockReturnValue({
        findAllTransactions: mockFindAllTransactions,
      }),
    };

    const mockConfigService = {
      getOrThrow: jest.fn().mockReturnValue('ILIACHALLENGE_INTERNAL'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserTransactionsUseCase,
        {
          provide: GRPC_WALLET_CLIENT,
          useValue: mockGrpcClient,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    useCase = module.get(GetUserTransactionsUseCase);
    useCase.onModuleInit();
  });

  it('should call wallet gRPC service and return mapped transactions', async () => {
    const result = await useCase.execute('user-123');

    expect(mockFindAllTransactions).toHaveBeenCalledTimes(1);
    expect(mockFindAllTransactions).toHaveBeenCalledWith(
      { userId: 'user-123' },
      expect.anything(),
    );
    expect(result).toEqual([
      { id: 'tx-1', user_id: 'user-123', amount: 100, type: 'CREDIT' },
      { id: 'tx-2', user_id: 'user-123', amount: 50, type: 'DEBIT' },
    ]);
  });

  it('should return empty array when no transactions', async () => {
    mockFindAllTransactions.mockReturnValueOnce(
      of({ transactions: [] }),
    );

    const result = await useCase.execute('user-456');

    expect(result).toEqual([]);
  });

  it('should handle null transactions in response', async () => {
    mockFindAllTransactions.mockReturnValueOnce(of({}));

    const result = await useCase.execute('user-789');

    expect(result).toEqual([]);
  });
});
