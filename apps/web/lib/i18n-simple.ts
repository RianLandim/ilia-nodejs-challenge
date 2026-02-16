'use client';

import { useLocale } from '@/lib/i18n/locale-context';
import { messages, type Namespace } from '@/lib/i18n/messages';

export function useTranslations(namespace: Namespace) {
  const { locale } = useLocale();
  return (key: string): string => {
    const ns = messages[locale][namespace];
    return ns?.[key] ?? key;
  };
}
