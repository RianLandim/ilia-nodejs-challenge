'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/lib/i18n-simple';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Receipt } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';

const navigation = [
  {
    name: 'dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'transactions',
    href: '/dashboard/transactions',
    icon: Receipt,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const tDashboard = useTranslations('dashboard');
  const tTransactions = useTranslations('transactions');

  const getLabel = (name: string) => {
    if (name === 'dashboard') return tDashboard('title');
    if (name === 'transactions') return tTransactions('title');
    return name;
  };

  return (
    <aside className="flex w-64 flex-col border-r border-border/80 bg-muted/30 min-h-[calc(100vh-4rem)]">
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {getLabel(item.name)}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border/80 p-4">
        <LanguageSwitcher />
      </div>
    </aside>
  );
}
