
import React from 'react';
import { useNavigate } from 'react-router-dom';
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

interface RegisterFormProps {
  onSuccess: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { t } = useTranslation();
  const { register: registerUser, isLoading, error } = useAuth();
  
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
    try {
      console.log("Enviando dados de registro:", values);
      
      const success = await registerUser(
        values.name, 
        values.email, 
        values.password, 
        values.role
      );
      
      if (success) {
        console.log("Registro bem-sucedido!");
        onSuccess();
      }
    } catch (err) {
      console.error('Erro no registro:', err);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.fullName', 'Nome completo')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t('auth.fullNamePlaceholder', 'Digite seu nome completo')}
                  className="bg-zinc-800 border-zinc-700"
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
          autoComplete="new-password"
        />
        
        <PasswordInput
          form={form}
          name="confirmPassword"
          label={t('auth.confirmPassword', 'Confirme sua senha')}
          autoComplete="new-password"
        />
        
        <RoleSelector form={form} />
        
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('auth.creatingAccount', 'Criando conta...')}
            </>
          ) : (
            t('auth.createAccount', 'Criar conta')
          )}
        </Button>
      </form>
    </Form>
  );
};
