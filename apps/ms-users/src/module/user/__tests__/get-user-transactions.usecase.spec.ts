import { Test, TestingModule } from '@nestjs/testing';
import { Metadata } from '@grpc/grpc-js';
import { of } from 'rxjs';
import { GetUserTransactionsUseCase } from '../usecase/get-user-transactions.usecase';
import { GRPC_WALLET_CLIENT } from '@ilia/grpc';
import { InternalGrpcMetadataService } from '../../../common/services/internal-grpc-metadata.service';

describe('GetUserTransactionsUseCase', () => {
  let useCase: GetUserTransactionsUseCase;
  let mockFindAllTransactions: jest.Mock;
  let mockCreateMetadataForUser: jest.Mock;

  beforeEach(async () => {
    mockFindAllTransactions = jest.fn().mockReturnValue(
      of({
        transactions: [
          { id: 'tx-1', userId: 'user-123', amount: 100, type: 0 },
          { id: 'tx-2', userId: 'user-123', amount: 50, type: 1 },
        ],
      }),
    );

    const mockMetadata = new Metadata();
    mockCreateMetadataForUser = jest.fn().mockReturnValue(mockMetadata);

    const mockGrpcClient = {
      getService: jest.fn().mockReturnValue({
        findAllTransactions: mockFindAllTransactions,
      }),
    };

    const mockInternalGrpcMetadataService = {
      createMetadataForUser: mockCreateMetadataForUser,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserTransactionsUseCase,
        {
          provide: GRPC_WALLET_CLIENT,
          useValue: mockGrpcClient,
        },
        {
          provide: InternalGrpcMetadataService,
          useValue: mockInternalGrpcMetadataService,
        },
      ],
    }).compile();

    useCase = module.get(GetUserTransactionsUseCase);
    useCase.onModuleInit();
  });

  it('should call wallet gRPC service and return mapped transactions', async () => {
    const result = await useCase.execute('user-123');

    expect(mockCreateMetadataForUser).toHaveBeenCalledWith('user-123');
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
