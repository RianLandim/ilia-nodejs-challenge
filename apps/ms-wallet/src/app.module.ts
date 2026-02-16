import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
import { BalanceModule } from './module/balance/balance.module';
import { TransactionModule } from './module/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TransactionModule,
    BalanceModule,
  ],
})
export class AppModule {}
