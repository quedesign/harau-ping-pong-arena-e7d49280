
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth';

const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ForgotPassword = () => {
  const { t } = useTranslation();
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false); 
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await resetPassword(values.email);
      setSuccess(true);
    } catch (err) {
      console.error('Erro ao enviar email de redefinição:', err);
      setError(t('auth.resetPasswordFailed', 'Erro ao enviar email de redefinição. Por favor, tente novamente.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center py-8 px-4">
        <Card className="w-full max-w-md border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t('auth.resetPassword', 'Esqueceu sua senha?')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('auth.resetPasswordInstructions', 'Insira seu email para receber instruções de redefinição de senha')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <Alert className="bg-green-900/30 border-green-800 text-green-200 mb-4">
                <AlertDescription>
                  {t('auth.resetPasswordEmailSent', 'Email de redefinição enviado. Verifique sua caixa de entrada.')}
                </AlertDescription>
              </Alert>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="mb-4">
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

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('auth.sending', 'Enviando...')}
                      </>
                    ) : (
                      t('auth.sendResetInstructions', 'Enviar instruções')
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-zinc-400 w-full">
              {t('auth.rememberPassword', 'Lembrou sua senha?')}{' '}
              <Link to="/login" className="text-primary hover:underline">
                {t('auth.backToLogin', 'Voltar para o login')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
