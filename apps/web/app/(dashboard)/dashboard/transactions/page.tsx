'use client';

import { useState } from 'react';
import { useTranslations } from '@/lib/i18n-simple';
import { TransactionList } from '@/components/transactions/transaction-list';
import { TransactionFilters } from '@/components/transactions/transaction-filters';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { TransactionType } from '@/types';

export default function TransactionsPage() {
  const t = useTranslations('transactions');
  const [filter, setFilter] = useState<TransactionType | undefined>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <Button asChild>
          <Link href="/dashboard/transactions/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('new')}
          </Link>
        </Button>
      </div>
      <TransactionFilters activeFilter={filter} onFilterChange={setFilter} />
      <TransactionList type={filter} />
    </div>
  );
}
