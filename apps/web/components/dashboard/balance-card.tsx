'use client';

import { useTranslations } from '@/lib/i18n-simple';
import { useBalance } from '@/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

export function BalanceCard() {
  const t = useTranslations('dashboard');
  const { data, isLoading, error } = useBalance();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('balance')}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-12 w-48" />
        ) : error ? (
          <p className="text-red-500 text-sm">Erro ao carregar saldo</p>
        ) : (
          <p className="text-4xl font-bold">
            {formatCurrency(data?.balance ?? 0)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
