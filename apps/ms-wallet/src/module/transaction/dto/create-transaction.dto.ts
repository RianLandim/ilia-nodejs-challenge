import { z } from 'zod';

export const TRANSACTION_TYPES = ['CREDIT', 'DEBIT'] as const;

export const transactionTypeSchema = z.enum(TRANSACTION_TYPES, {
  message: 'type deve ser CREDIT ou DEBIT',
});

export type TransactionType = z.infer<typeof transactionTypeSchema>;

export const createTransactionSchema = z.object({
  userId: z.string('userId é obrigatório').min(1, 'userId não pode ser vazio'),
  amount: z
    .number('amount é obrigatório')
    .int('amount deve ser um número inteiro')
    .positive('amount deve ser maior que zero'),
  type: transactionTypeSchema,
});

export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;
