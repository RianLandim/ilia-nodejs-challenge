import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/lib/api';
import { TransactionType } from '@/types';

export function useTransactions(type?: TransactionType) {
  return useQuery({
    queryKey: ['transactions', type],
    queryFn: () => transactionsApi.getAll(type),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
}
