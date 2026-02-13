import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../repository/transaction.repository';

export type ListTransactionsInput = {
  userId: string;
  type?: 'CREDIT' | 'DEBIT';
};

@Injectable()
export class ListTransactionsByUserUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(input: ListTransactionsInput) {
    return this.transactionRepository.findByUserId(input.userId, {
      type: input.type,
    });
  }
}
