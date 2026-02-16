import { join } from 'path';
import { Transport, GrpcOptions } from '@nestjs/microservices';
import { WALLET_PACKAGE_NAME } from './constants';

export const walletGrpcServerOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: WALLET_PACKAGE_NAME,
    protoPath: join(__dirname, '../../proto/wallet.proto'),
    url: process.env.GRPC_WALLET_URL || '0.0.0.0:50052',
  },
};

export const walletGrpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: WALLET_PACKAGE_NAME,
    protoPath: join(__dirname, '../../proto/wallet.proto'),
    url: process.env.GRPC_WALLET_URL || 'localhost:50052',
  },
};
