'use client';

import { useTranslations } from '@/lib/i18n-simple';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export function QuickActions() {
  const t = useTranslations('dashboard');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('quickActions')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href="transactions/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('newTransaction')}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
