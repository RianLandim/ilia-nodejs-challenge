import { Body, Controller, Post, UsePipes } from '@nestjs/common';

import { ZodValidationPipe } from '../../common/pipes/validation.pipe';
import { CreateTransactionDto, createTransactionSchema } from './dto';
import { CreateTransactionUseCase } from './usecase/create-transaction.usecase';

@Controller('transaction')
export class TransactionController {
  constructor(private createTransactionUseCase: CreateTransactionUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createTransactionSchema))
  async createTransaction(@Body() data: CreateTransactionDto) {
    return await this.createTransactionUseCase.execute(data);
  }
}
