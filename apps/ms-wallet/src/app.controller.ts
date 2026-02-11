import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AppService } from './app.service';
import { WALLET_SERVICE_NAME } from '@ilia/grpc';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod(WALLET_SERVICE_NAME, 'CreateTransaction')
  createTransaction(data: any) {
    return this.appService.createTransaction(data);
  }

  @GrpcMethod(WALLET_SERVICE_NAME, 'FindAllTransactions')
  findAllTransactions(data: any) {
    return this.appService.findAllTransactions(data);
  }

  @GrpcMethod(WALLET_SERVICE_NAME, 'GetBalance')
  getBalance(data: any) {
    return this.appService.getBalance(data);
  }
}
