'use client';

import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/i18n-simple';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

export function Header() {
  const t = useTranslations('auth');
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-10 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-primary tracking-tight">Ília Wallet</h1>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>{(user.first_name && user.last_name) ? `${user.first_name} ${user.last_name}` : user.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
