'use client';

import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useTranslations } from '@/lib/i18n-simple';

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const t = useTranslations('transactions');
  const isCredit = transaction.type === 'CREDIT';

  return (
    <div className="flex items-center justify-between p-4 border border-border/80 rounded-xl hover:bg-muted/40 transition-all duration-200">
      <div className="flex items-center gap-3">
        {isCredit ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <ArrowUpCircle className="h-5 w-5 text-primary" />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
            <ArrowDownCircle className="h-5 w-5 text-destructive" />
          </div>
        )}
        <div>
          <Badge variant={isCredit ? 'default' : 'secondary'}>
            {isCredit ? t('credit') : t('debit')}
          </Badge>
          {transaction.created_at && (
            <p className="text-xs text-muted-foreground mt-1">
              {formatDate(transaction.created_at)}
            </p>
          )}
        </div>
      </div>
      <p className={`font-semibold tabular-nums ${isCredit ? 'text-primary' : 'text-destructive'}`}>
        {isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
      </p>
    </div>
  );
}
