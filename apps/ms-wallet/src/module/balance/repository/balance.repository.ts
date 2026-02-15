export abstract class BalanceRepository {
  abstract getBalance(userId: string): Promise<number>;
}
