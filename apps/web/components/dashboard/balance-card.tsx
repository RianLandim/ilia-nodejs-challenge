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
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle className="text-muted-foreground font-medium">{t('balance')}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-14 w-56 rounded-lg" />
        ) : error ? (
          <p className="text-destructive text-sm">Erro ao carregar saldo</p>
        ) : (
          <p className="text-4xl font-bold tracking-tight text-primary tabular-nums">
            {formatCurrency(data?.balance ?? 0)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
