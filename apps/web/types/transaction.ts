export type TransactionType = 'CREDIT' | 'DEBIT';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  created_at?: string;
}

export interface CreateTransactionData {
  userId: string;
  amount: number;
  type: TransactionType;
}

export interface ListTransactionsQuery {
  type?: TransactionType;
}
