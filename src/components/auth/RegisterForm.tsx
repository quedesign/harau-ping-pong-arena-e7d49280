
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { registerSchema, type RegisterFormValues } from '@/pages/auth/schema';
import { PasswordInput } from './PasswordInput';
import { RoleSelector } from './RoleSelector';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

interface RegisterFormProps {
  onSuccess: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { t } = useTranslation();
  const { registerWithEmailAndPassword, isLoading, error, currentUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  
  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'athlete',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      console.log('Registrando usuário:', values);
      await registerWithEmailAndPassword(
        values.name,
        values.email,
        values.password,
        values.role
      );
      
      // The toast and navigation will be handled in the AuthProvider
      onSuccess();
    } catch (err) {
      console.error('Erro no registro:', err);
      setServerError(err instanceof Error ? err.message : 'Erro desconhecido ao registrar');
      toast.error("Erro ao registrar usuário", {
        description: err instanceof Error ? err.message : 'Erro desconhecido ao registrar'
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {(error || serverError) && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || serverError}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.name', 'Nome')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder={t('auth.namePlaceholder', 'Digite seu nome completo')}
                  autoComplete="name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="exemplo@email.com"
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
          autoComplete="new-password"
        />

        <PasswordInput
          form={form}
          name="confirmPassword"
          label={t('auth.confirmPassword', 'Confirmar senha')}
          autoComplete="new-password"
        />

        <RoleSelector form={form} />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('auth.registering', 'Registrando...')}
            </>
          ) : (
            t('auth.register', 'Criar conta')
          )}
        </Button>
      </form>
    </Form>
  );
};
