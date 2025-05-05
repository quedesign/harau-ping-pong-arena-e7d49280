import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';
import { loginSchema, type LoginFormValues } from '@/pages/auth/schema';
import { PasswordInput } from './PasswordInput';
import { useAuth } from '@/contexts/auth';
import { Link, useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const { t } = useTranslation();
  const { login, isLoading, error, setError } = useAuth();
  const navigate = useNavigate();

  
    const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
        await login(values.email, values.password, (user) => {
            setError(null);
            navigate("/dashboard");
        });
    } catch (err) {
        //Error handled in the useLogin hook
    }
  };

    return (
      <Form {...form}>
        <>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.password', 'Senha')}</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} autoComplete="current-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                {t('auth.forgotPassword', 'Esqueceu a senha?')}
              </Link>
            </div>
          </form>
        </>
      </Form>
  );
};
