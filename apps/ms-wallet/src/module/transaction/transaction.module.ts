import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionRepository } from './repository/transaction.repository';
import { PrismaTransactionRepository } from './repository/prisma-transaction.repository';
import { DatabaseService } from 'src/config/database.config';
import { CreateTransactionUseCase } from './usecase/create-transaction.usecase';

@Module({
  controllers: [TransactionController],
  providers: [
    DatabaseService,
    CreateTransactionUseCase,
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository,
    },
  ],
})
export class TransactionModule {}
