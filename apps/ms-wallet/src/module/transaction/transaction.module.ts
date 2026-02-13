import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionRepository } from './repository/transaction.repository';
import { PrismaTransactionRepository } from './repository/prisma-transaction.repository';
import { DatabaseService } from 'src/config/database.config';
import { CreateTransactionUseCase } from './usecase/create-transaction.usecase';
import { ListTransactionsByUserUseCase } from './usecase/list-transactions-by-user.usecase';

@Module({
  controllers: [TransactionController],
  providers: [
    DatabaseService,
    CreateTransactionUseCase,
    ListTransactionsByUserUseCase,
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository,
    },
  ],
})
export class TransactionModule {}
