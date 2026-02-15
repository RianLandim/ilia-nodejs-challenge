import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetBalanceUseCase } from './usecase/get-balance.usecase';

@Controller('balance')
export class BalanceController {
  constructor(private getBalanceUseCase: GetBalanceUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getBalance(@CurrentUser('id') userId: string) {
    return await this.getBalanceUseCase.execute(userId);
  }
}
