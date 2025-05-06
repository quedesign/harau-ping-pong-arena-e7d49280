
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { loginSchema, type LoginFormValues } from '@/pages/auth/schema';
import { useAuth } from '@/contexts/auth';
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from 'react-router-dom';
import { PasswordInput } from "@/components/auth/PasswordInput";

export const LoginForm = () => {
  const { t } = useTranslation();
  const { login, isLoading, error, setError, loginWithGoogle } = useAuth();
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
      const success = await login(values.email, values.password);
      
      if (success && !error) {
        if (setError) setError(null);
        navigate('/dashboard');
      }
    } catch (err) {
      // Error handled in the useLogin hook
    }
  };

  const handleGoogleLogin = async () => {
    if (!loginWithGoogle) return;
    
    try {
      await loginWithGoogle();
      navigate('/dashboard');
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
                  <FormLabel>{t("auth.email", "Email")}</FormLabel>
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
                  <PasswordInput form={form} name="password" label={t("auth.password", "Senha")} />
                </FormItem>
            )}
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
        {loginWithGoogle && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Mail className="mr-2 h-4 w-4" />
            {t("auth.loginWithGoogle", "Entrar com o Google")}
          </Button>
        )}
    </form>
  );
};
