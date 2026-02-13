import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { WALLET_SERVICE_NAME } from '@ilia/grpc';
import { GrpcInternalAuthGuard } from '../../common/guards/grpc-internal-auth.guard';
import { ListTransactionsByUserUseCase } from './usecase/list-transactions-by-user.usecase';

interface FindAllTransactionsRequest {
  userId: string;
  type?: number;
}

const TYPE_MAP: Record<number, 'CREDIT' | 'DEBIT'> = {
  0: 'CREDIT',
  1: 'DEBIT',
};

@Controller()
export class TransactionGrpcController {
  constructor(
    private listTransactionsByUserUseCase: ListTransactionsByUserUseCase,
  ) {}

  @GrpcMethod(WALLET_SERVICE_NAME, 'FindAllTransactions')
  @UseGuards(GrpcInternalAuthGuard)
  async findAllTransactions(data: FindAllTransactionsRequest) {
    const type = data.type !== undefined ? TYPE_MAP[data.type] : undefined;

    const list = await this.listTransactionsByUserUseCase.execute({
      userId: data.userId,
      type,
    });

    return {
      transactions: list.map((t) => ({
        id: t.id,
        userId: t.userId,
        amount: Math.round(t.amount),
        type: t.type === 'CREDIT' ? 0 : 1,
      })),
    };
  }
}
