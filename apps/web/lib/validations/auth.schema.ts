import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ message: 'Email é obrigatório' })
    .email('Email deve ser válido'),
  password: z
    .string({ message: 'Senha é obrigatória' })
    .min(1, 'Senha é obrigatória'),
});

export const registerSchema = z.object({
  first_name: z
    .string({ message: 'Nome é obrigatório' })
    .min(1, 'Nome não pode ser vazio'),
  last_name: z
    .string({ message: 'Sobrenome é obrigatório' })
    .min(1, 'Sobrenome não pode ser vazio'),
  email: z
    .string({ message: 'Email é obrigatório' })
    .email('Email deve ser válido'),
  password: z
    .string({ message: 'Senha é obrigatória' })
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
