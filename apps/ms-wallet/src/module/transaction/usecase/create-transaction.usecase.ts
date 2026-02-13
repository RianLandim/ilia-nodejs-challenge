import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../repository/transaction.repository';
import { CreateTransactionDto } from '../dto';

@Injectable()
export class CreateTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(data: CreateTransactionDto) {
    return await this.transactionRepository.createTransacation(data);
  }
}
