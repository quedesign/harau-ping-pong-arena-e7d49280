
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { loginSchema, type LoginFormValues } from '@/pages/auth/schema';
import { PasswordInput } from './PasswordInput';
import { useAuth } from '@/contexts/auth';
import { Link } from 'react-router-dom';

export const LoginForm = () => {
  const { t } = useTranslation();
  const { login, isLoading, error } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
    } catch (err) {
      console.error('Erro no login:', err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.email', 'Email')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="exemplo@email.com"
                  className="bg-zinc-800 border-zinc-700"
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <PasswordInput
          form={form}
          name="password"
          label={t('auth.password', 'Senha')}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            {t('auth.forgotPassword', 'Esqueceu a senha?')}
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('auth.loggingIn', 'Entrando...')}
            </>
          ) : (
            t('auth.login', 'Entrar')
          )}
        </Button>
      </form>
    </Form>
  );
};
