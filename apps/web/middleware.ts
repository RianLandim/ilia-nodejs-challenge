import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'never', // Don't prefix the URL with locale
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
