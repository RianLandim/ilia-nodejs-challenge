import { z } from 'zod';

export const transactionTypeSchema = z.enum(['CREDIT', 'DEBIT'], {
  message: 'Tipo deve ser CREDIT ou DEBIT',
});

export const createTransactionSchema = z.object({
  amount: z
    .number({ message: 'Valor é obrigatório' })
    .int('Valor deve ser um número inteiro')
    .positive('Valor deve ser maior que zero'),
  type: transactionTypeSchema,
});

export type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;
