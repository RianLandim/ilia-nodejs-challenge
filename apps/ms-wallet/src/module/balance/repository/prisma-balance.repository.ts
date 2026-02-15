import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/config/database.config';
import { BalanceRepository } from './balance.repository';

@Injectable()
export class PrismaBalanceRepository implements BalanceRepository {
  constructor(private databaseService: DatabaseService) {}

  async getBalance(userId: string): Promise<number> {
    const [credits, debits] = await Promise.all([
      this.databaseService.transaction.aggregate({
        where: { userId, type: 'CREDIT' },
        _sum: { amount: true },
      }),
      this.databaseService.transaction.aggregate({
        where: { userId, type: 'DEBIT' },
        _sum: { amount: true },
      }),
    ]);
    const creditSum = credits._sum?.amount ?? 0;
    const debitSum = debits._sum?.amount ?? 0;
    return Math.round(creditSum - debitSum);
  }
}
