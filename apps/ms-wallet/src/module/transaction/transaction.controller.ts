import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';

import { ZodValidationPipe } from '../../common/pipes/validation.pipe';
import { CreateTransactionDto, createTransactionSchema } from './dto';
import { CreateTransactionUseCase } from './usecase/create-transaction.usecase';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('transaction')
export class TransactionController {
  constructor(private createTransactionUseCase: CreateTransactionUseCase) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(createTransactionSchema))
  async createTransaction(@Body() data: CreateTransactionDto) {
    return await this.createTransactionUseCase.execute(data);
  }
}
