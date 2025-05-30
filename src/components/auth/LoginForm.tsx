
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { loginSchema, type LoginFormValues } from '@/pages/auth/schema';
import { useAuth } from '@/contexts/auth';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { PasswordInput } from '@/components/auth/PasswordInput';

export const LoginForm = () => {
  const { t } = useTranslation();
  const {
    loginWithEmailAndPassword,
    isLoading,
    error,
    loginWithGoogle,
  } = useAuth();
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
      await loginWithEmailAndPassword(values.email, values.password);
      if (!error) {
        navigate('/dashboard');
      }
    } catch (err) {
      // Error handled in the useLogin hook
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Redirect will be handled by the auth state listener
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  const alert = error && (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {alert}
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
            <PasswordInput
              form={form}
              name="password"
              label={t('auth.password', 'Senha')}
            />
          </FormItem>
        )}
      />
      <div className="flex items-center justify-between">
        <Link
          to="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
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

      {/* Botão de login com Google */}
      <Button
        type="button"
        variant="outline"
        className="w-full mt-2 flex items-center justify-center"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className="mr-2 h-5 w-5"
        >
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {t('auth.loginWithGoogle', 'Entrar com o Google')}
      </Button>
    </form>
  );
};
