import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from './config';

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !isLocale(locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
