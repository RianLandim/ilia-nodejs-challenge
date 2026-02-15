'use client';

import { useTranslations } from '@/lib/i18n-simple';
import { Button } from '@/components/ui/button';
import { TransactionType } from '@/types';

interface TransactionFiltersProps {
  activeFilter?: TransactionType;
  onFilterChange: (type?: TransactionType) => void;
}

export function TransactionFilters({ activeFilter, onFilterChange }: TransactionFiltersProps) {
  const t = useTranslations('transactions');

  return (
    <div className="flex gap-2">
      <Button
        variant={!activeFilter ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange(undefined)}
      >
        {t('all')}
      </Button>
      <Button
        variant={activeFilter === 'CREDIT' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('CREDIT')}
      >
        {t('credit')}
      </Button>
      <Button
        variant={activeFilter === 'DEBIT' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFilterChange('DEBIT')}
      >
        {t('debit')}
      </Button>
    </div>
  );
}
