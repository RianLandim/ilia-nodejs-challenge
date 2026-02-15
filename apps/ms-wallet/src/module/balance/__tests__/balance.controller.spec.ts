import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from '../balance.controller';
import { GetBalanceUseCase } from '../usecase/get-balance.usecase';

describe('BalanceController', () => {
  let controller: BalanceController;
  let getBalanceUseCase: jest.Mocked<GetBalanceUseCase>;

  beforeEach(async () => {
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue({ balance: 2000 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [
        {
          provide: GetBalanceUseCase,
          useValue: mockUseCase,
        },
      ],
    }).compile();

    controller = module.get(BalanceController);
    getBalanceUseCase = module.get(GetBalanceUseCase);
  });

  it('should return balance for the authenticated user', async () => {
    const userId = 'user-123';
    const result = await controller.getBalance(userId);

    expect(getBalanceUseCase.execute).toHaveBeenCalledTimes(1);
    expect(getBalanceUseCase.execute).toHaveBeenCalledWith(userId);
    expect(result).toEqual({ balance: 2000 });
  });
});
