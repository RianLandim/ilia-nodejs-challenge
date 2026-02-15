'use client';

import { useTranslations } from '@/lib/i18n-simple';
import { useTransactions } from '@/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TransactionItem } from '../transactions/transaction-item';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function RecentTransactions() {
  const t = useTranslations('dashboard');
  const { data: transactions, isLoading } = useTransactions();

  const recentTransactions = transactions?.slice(0, 5) ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('recentTransactions')}</CardTitle>
        <Button variant="ghost" asChild>
          <Link href="/transactions">{t('viewAll')}</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : recentTransactions.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            {t('noTransactions')}
          </p>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
