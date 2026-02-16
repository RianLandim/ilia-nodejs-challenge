import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionGrpcController } from './transaction-grpc.controller';
import { TransactionRepository } from './repository/transaction.repository';
import { PrismaTransactionRepository } from './repository/prisma-transaction.repository';
import { CreateTransactionUseCase } from './usecase/create-transaction.usecase';
import { ListTransactionsByUserUseCase } from './usecase/list-transactions-by-user.usecase';
import { GrpcInternalAuthGuard } from '../../common/guards/grpc-internal-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [TransactionController, TransactionGrpcController],
  providers: [
    JwtStrategy,
    GrpcInternalAuthGuard,
    CreateTransactionUseCase,
    ListTransactionsByUserUseCase,
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository,
    },
  ],
})
export class TransactionModule {}
