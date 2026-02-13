import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/validation.pipe';
import {
  CreateTransactionDto,
  createTransactionSchema,
  listTransactionsQuerySchema,
  ListTransactionsQueryDto,
} from './dto';
import { CreateTransactionUseCase } from './usecase/create-transaction.usecase';
import { ListTransactionsByUserUseCase } from './usecase/list-transactions-by-user.usecase';

@Controller('transactions')
export class TransactionController {
  constructor(
    private createTransactionUseCase: CreateTransactionUseCase,
    private listTransactionsByUserUseCase: ListTransactionsByUserUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(createTransactionSchema))
  async createTransaction(@Body() data: CreateTransactionDto) {
    return await this.createTransactionUseCase.execute(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async list(
    @CurrentUser('id') userId: string,
    @Query(new ZodValidationPipe(listTransactionsQuerySchema))
    query: ListTransactionsQueryDto,
  ) {
    const list = await this.listTransactionsByUserUseCase.execute({
      userId,
      type: query.type,
    });
    return list.map((t) => ({
      id: t.id,
      user_id: t.userId,
      type: t.type,
      amount: Math.round(t.amount),
    }));
  }
}
