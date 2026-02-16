import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { BalanceController } from './balance.controller';
import { BalanceRepository } from './repository/balance.repository';
import { PrismaBalanceRepository } from './repository/prisma-balance.repository';
import { GetBalanceUseCase } from './usecase/get-balance.usecase';

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
  controllers: [BalanceController],
  providers: [
    JwtStrategy,
    GetBalanceUseCase,
    {
      provide: BalanceRepository,
      useClass: PrismaBalanceRepository,
    },
  ],
})
export class BalanceModule {}
