'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { isAxiosError } from 'axios';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { useAuth } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export function LoginForm() {
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'loginTitle': 'Bem-vindo de volta',
      'loginSubtitle': 'Entre com suas credenciais',
      'email': 'Email',
      'password': 'Senha',
      'login': 'Entrar',
      'dontHaveAccount': 'Não tem uma conta?',
      'register': 'Cadastrar',
      'loginError': 'Email ou senha inválidos',
      'loading': 'Carregando...',
    };
    return translations[key] || key;
  };
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await login(data);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message =
        isAxiosError(err) && typeof err.response?.data === 'object' && err.response.data !== null && 'message' in err.response.data
          ? String((err.response.data as { message: unknown }).message)
          : t('loginError');
      setError(message);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t('loginTitle')}</CardTitle>
        <CardDescription>{t('loginSubtitle')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('loading') : t('login')}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            {t('dontHaveAccount')}{' '}
            <Link href="/register" className="text-primary hover:underline">
              {t('register')}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
