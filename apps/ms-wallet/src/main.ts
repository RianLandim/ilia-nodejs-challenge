import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { walletGrpcServerOptions } from '@ilia/grpc';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice(walletGrpcServerOptions);

  await app.startAllMicroservices();

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`HTTP server running on port ${port}`);
  logger.log(`gRPC server running on ${walletGrpcServerOptions.options?.url}`);
}
bootstrap();
