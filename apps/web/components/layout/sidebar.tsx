'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/lib/i18n-simple';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Receipt } from 'lucide-react';

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
    <aside className="w-64 border-r bg-muted/10 min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {getLabel(item.name)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
