import { z } from 'zod';

export const createUserSchema = z.object({
  first_name: z
    .string({ message: 'first_name é obrigatório' })
    .min(1, 'first_name não pode ser vazio'),
  last_name: z
    .string({ message: 'last_name é obrigatório' })
    .min(1, 'last_name não pode ser vazio'),
  email: z
    .string({ message: 'email é obrigatório' })
    .email('email deve ser um email válido'),
  password: z
    .string({ message: 'password é obrigatório' })
    .min(6, 'password deve ter no mínimo 6 caracteres'),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  first_name: z.string().min(1, 'first_name não pode ser vazio').optional(),
  last_name: z.string().min(1, 'last_name não pode ser vazio').optional(),
  email: z.string().email('email deve ser um email válido').optional(),
  password: z.string().min(6, 'password deve ter no mínimo 6 caracteres').optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
