import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { walletGrpcServerOptions } from '@ilia/grpc';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    walletGrpcServerOptions,
  );
  await app.listen();
  console.log('MS-Wallet gRPC microservice is running on:', walletGrpcServerOptions.options?.url);
}
bootstrap();
