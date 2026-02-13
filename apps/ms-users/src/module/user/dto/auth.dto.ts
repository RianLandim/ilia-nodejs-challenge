import { z } from 'zod';

export const authSchema = z.object({
  email: z
    .string({ message: 'email é obrigatório' })
    .email('email deve ser um email válido'),
  password: z.string({ message: 'password é obrigatório' }),
});

export type AuthDto = z.infer<typeof authSchema>;

export interface AuthResponse {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  access_token: string;
}
