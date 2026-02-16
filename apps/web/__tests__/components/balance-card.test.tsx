import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock i18n-simple
vi.mock('@/lib/i18n-simple', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock hooks
vi.mock('@/hooks', () => ({
  useBalance: () => ({
    data: { balance: 10000 },
    isLoading: false,
    error: null,
  }),
}));

describe('BalanceCard', () => {
  it('renders balance correctly', () => {
    const queryClient = new QueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <BalanceCard />
      </QueryClientProvider>
    );

    expect(screen.getByText('balance')).toBeInTheDocument();
  });
});
