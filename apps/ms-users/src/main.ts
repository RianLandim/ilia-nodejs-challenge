import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { usersGrpcServerOptions } from '@ilia/grpc';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.connectMicroservice(usersGrpcServerOptions);

  await app.startAllMicroservices();

  const port = process.env.PORT || 3002;
  await app.listen(port);

  logger.log(`HTTP server running on port ${port}`);
  logger.log(`gRPC server running on ${usersGrpcServerOptions.options?.url}`);
}
bootstrap();
