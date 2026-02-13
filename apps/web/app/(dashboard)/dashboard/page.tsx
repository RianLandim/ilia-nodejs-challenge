import { BalanceCard } from '@/components/dashboard/balance-card';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { QuickActions } from '@/components/dashboard/quick-actions';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BalanceCard />
        <QuickActions />
      </div>
      <RecentTransactions />
    </div>
  );
}
