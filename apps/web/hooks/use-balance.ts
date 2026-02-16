import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '@/lib/api';

export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: () => transactionsApi.getBalance(),
  });
}
