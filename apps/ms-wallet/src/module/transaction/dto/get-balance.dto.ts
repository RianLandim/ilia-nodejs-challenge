import { z } from 'zod';

export const getBalanceSchema = z.object({
  userId: z.string('userId é obrigatório').min(1, 'userId não pode ser vazio'),
});

export type GetBalanceDto = z.infer<typeof getBalanceSchema>;
