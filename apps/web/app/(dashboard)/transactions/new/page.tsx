import { TransactionForm } from '@/components/transactions/transaction-form';

export default function NewTransactionPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Nova Transação</h1>
      <TransactionForm />
    </div>
  );
}
