import type { Locale } from '@/i18n/config';

import ptBR from '@/i18n/locales/pt-BR.json';
import en from '@/i18n/locales/en.json';

export type Namespace = 'auth' | 'dashboard' | 'transactions' | 'common';

export type Messages = Record<Locale, Record<Namespace, Record<string, string>>>;

export const messages: Messages = {
  'pt-BR': ptBR as Record<Namespace, Record<string, string>>,
  en: en as Record<Namespace, Record<string, string>>,
};
