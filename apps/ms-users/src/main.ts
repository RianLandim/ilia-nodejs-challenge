import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { usersGrpcServerOptions } from '@ilia/grpc';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule,
    usersGrpcServerOptions,
  );
  await app.listen();
  console.log('MS-Users gRPC microservice is running on:', usersGrpcServerOptions.options?.url);
}
bootstrap();
