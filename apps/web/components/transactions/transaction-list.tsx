'use client';

import { useTransactions } from '@/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { TransactionItem } from './transaction-item';
import { EmptyState } from './empty-state';
import { TransactionType } from '@/types';

interface TransactionListProps {
  type?: TransactionType;
}

export function TransactionList({ type }: TransactionListProps) {
  const { data: transactions, isLoading } = useTransactions(type);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
}
