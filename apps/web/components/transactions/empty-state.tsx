'use client';

import { useTranslations } from '@/lib/i18n-simple';
import { FileX } from 'lucide-react';

export function EmptyState() {
  const t = useTranslations('transactions');

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileX className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-muted-foreground">{t('empty')}</p>
    </div>
  );
}
