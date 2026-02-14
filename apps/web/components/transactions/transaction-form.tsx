'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { useTranslations } from '@/lib/i18n-simple';
import { createTransactionSchema, CreateTransactionFormData } from '@/lib/validations';
import { useCreateTransaction } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function TransactionForm() {
  const t = useTranslations('transactions');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const createTransaction = useCreateTransaction();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type: 'CREDIT',
    },
  });

  const onSubmit = async (data: CreateTransactionFormData) => {
    try {
      await createTransaction.mutateAsync(data);
      toast.success(t('createSuccess'));
      router.push('/dashboard/transactions');
    } catch (err: unknown) {
      const message =
        isAxiosError(err) && typeof err.response?.data === 'object' && err.response.data !== null && 'message' in err.response.data
          ? String((err.response.data as { message: unknown }).message)
          : t('createError');
      toast.error(message);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t('createTitle')}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">{t('type')}</Label>
            <Select
              onValueChange={(value) => setValue('type', value as 'CREDIT' | 'DEBIT')}
              defaultValue="CREDIT"
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CREDIT">{t('credit')}</SelectItem>
                <SelectItem value="DEBIT">{t('debit')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">{t('amount')}</Label>
            <Input
              id="amount"
              type="number"
              {...register('amount', { valueAsNumber: true })}
              disabled={isSubmitting}
              placeholder="100"
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Valor em centavos (ex: 100 = R$ 1,00)
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="flex-1"
            >
              {tCommon('cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? tCommon('loading') : tCommon('save')}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
