import { apiClient } from './client';
import { Transaction, TransactionType } from '@/types';

export const transactionsApi = {
  getAll: async (type?: TransactionType): Promise<Transaction[]> => {
    const params = type ? { type } : {};
    const { data } = await apiClient.get('/api/transactions', { params });
    return data;
  },

  create: async (transaction: {
    amount: number;
    type: TransactionType;
  }): Promise<Transaction> => {
    const { data } = await apiClient.post('/api/transactions', transaction);
    return data;
  },

  getBalance: async (): Promise<{ balance: number }> => {
    const { data } = await apiClient.get('/api/balance');
    return data;
  },
};
