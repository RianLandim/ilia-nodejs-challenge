import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // TODO: Implementar com banco de dados
  private transactions: any[] = [];

  createTransaction(data: { user_id: string; amount: number; type: number }) {
    const transaction = {
      id: crypto.randomUUID(),
      ...data,
    };
    this.transactions.push(transaction);
    return transaction;
  }

  findAllTransactions(data: { user_id: string; type?: number }) {
    let filtered = this.transactions.filter(
      (t) => t.user_id === data.user_id,
    );
    if (data.type !== undefined) {
      filtered = filtered.filter((t) => t.type === data.type);
    }
    return { transactions: filtered };
  }

  getBalance(data: { user_id: string }) {
    const userTransactions = this.transactions.filter(
      (t) => t.user_id === data.user_id,
    );
    const amount = userTransactions.reduce((acc, t) => {
      return t.type === 0 ? acc + t.amount : acc - t.amount; // 0 = CREDIT, 1 = DEBIT
    }, 0);
    return { amount };
  }
}
