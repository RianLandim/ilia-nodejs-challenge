import { join } from 'path';
import { Transport, GrpcOptions } from '@nestjs/microservices';
import { USERS_PACKAGE_NAME } from './constants';

export const usersGrpcServerOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: USERS_PACKAGE_NAME,
    protoPath: join(__dirname, '../../proto/users.proto'),
    url: process.env.GRPC_USERS_URL || '0.0.0.0:50051',
  },
};

export const usersGrpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: USERS_PACKAGE_NAME,
    protoPath: join(__dirname, '../../proto/users.proto'),
    url: process.env.GRPC_USERS_URL || 'localhost:50051',
  },
};
