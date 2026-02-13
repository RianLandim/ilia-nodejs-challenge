import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { DatabaseService } from 'src/config/database.config';
import { CreateTransactionDto } from '../dto';

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private databaseService: DatabaseService) {}

  async createTransacation(data: CreateTransactionDto): Promise<void> {
    await this.databaseService.transaction.create({
      data: {
        amount: data.amount,
        type: data.type,
        userId: data.userId,
      },
    });
  }

  async getBalance(): Promise<void> {}

  async findByUserId(
    userId: string,
    filter?: { type?: 'CREDIT' | 'DEBIT' },
  ) {
    return this.databaseService.transaction.findMany({
      where: {
        userId,
        ...(filter?.type && { type: filter.type }),
      },
      orderBy: { id: 'asc' },
    });
  }
}
