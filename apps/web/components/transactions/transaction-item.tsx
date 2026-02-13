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
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        {isCredit ? (
          <ArrowUpCircle className="h-5 w-5 text-green-500" />
        ) : (
          <ArrowDownCircle className="h-5 w-5 text-red-500" />
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
      <p className={`font-semibold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
        {isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
      </p>
    </div>
  );
}
