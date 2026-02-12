import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { walletGrpcServerOptions } from '@ilia/grpc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice(walletGrpcServerOptions);

  await app.startAllMicroservices();

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`MS-Wallet HTTP running on port ${port}`);
  console.log(
    `MS-Wallet gRPC running on ${walletGrpcServerOptions.options?.url}`,
  );
}
bootstrap();
