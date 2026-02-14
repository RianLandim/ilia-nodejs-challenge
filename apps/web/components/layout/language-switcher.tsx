'use client';

import { useLocale } from '@/lib/i18n/locale-context';
import { useTranslations } from '@/lib/i18n-simple';
import type { Locale } from '@/i18n/config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

const localeLabels: Record<Locale, string> = {
  'pt-BR': 'Português',
  en: 'English',
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const t = useTranslations('common');

  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
        <Globe className="h-4 w-4" />
        <span>{t('language')}</span>
      </div>
      <Select
        value={locale}
        onValueChange={(value) => setLocale(value as Locale)}
      >
        <SelectTrigger className="h-9 w-full rounded-lg border-border/80 bg-background/50">
          <SelectValue placeholder={t('language')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pt-BR">{localeLabels['pt-BR']}</SelectItem>
          <SelectItem value="en">{localeLabels.en}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
