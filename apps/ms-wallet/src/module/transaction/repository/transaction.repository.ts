import type { TransactionModel } from '../../../database/generated/prisma/models/Transaction';
import { CreateTransactionDto } from '../dto';

export type TransactionFilter = {
  type?: 'CREDIT' | 'DEBIT';
};

export abstract class TransactionRepository {
  abstract createTransacation(data: CreateTransactionDto): Promise<void>;
  abstract getBalance(): Promise<void>;
  abstract findByUserId(
    userId: string,
    filter?: TransactionFilter,
  ): Promise<TransactionModel[]>;
}
