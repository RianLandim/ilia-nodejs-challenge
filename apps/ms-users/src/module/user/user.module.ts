import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { GRPC_WALLET_CLIENT, walletGrpcClientOptions } from '@ilia/grpc';
import { UserController } from './user.controller';
import { AuthController } from './auth.controller';
import { UserRepository } from './repository/user.repository';
import { PrismaUserRepository } from './repository/prisma-user.repository';
import { DatabaseService } from '../../config/database.config';
import { CreateUserUseCase } from './usecase/create-user.usecase';
import { ListUsersUseCase } from './usecase/list-users.usecase';
import { GetUserUseCase } from './usecase/get-user.usecase';
import { UpdateUserUseCase } from './usecase/update-user.usecase';
import { DeleteUserUseCase } from './usecase/delete-user.usecase';
import { AuthUseCase } from './usecase/auth.usecase';
import { GetUserTransactionsUseCase } from './usecase/get-user-transactions.usecase';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
    ClientsModule.register([
      {
        name: GRPC_WALLET_CLIENT,
        ...walletGrpcClientOptions,
      },
    ]),
  ],
  controllers: [UserController, AuthController],
  providers: [
    DatabaseService,
    JwtStrategy,
    CreateUserUseCase,
    ListUsersUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    AuthUseCase,
    GetUserTransactionsUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
