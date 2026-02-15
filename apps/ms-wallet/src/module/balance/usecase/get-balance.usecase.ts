import { Injectable } from '@nestjs/common';
import { BalanceRepository } from '../repository/balance.repository';

@Injectable()
export class GetBalanceUseCase {
  constructor(private balanceRepository: BalanceRepository) {}

  async execute(userId: string): Promise<{ balance: number }> {
    const balance = await this.balanceRepository.getBalance(userId);
    return { balance };
  }
}
