
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormValues } from './schema';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error } = useAuth();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
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
        setRegistrationSuccess(true);
        
        // Redirecionar após um pequeno atraso para que o usuário possa ver a mensagem de sucesso
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        console.log("Registro falhou!");
      }
    } catch (err) {
      console.error('Erro no registro:', err);
    }
  };
  
  return (
    <Layout>
      <div className="flex justify-center items-center py-8">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Faça parte da maior comunidade de tênis de mesa
            </CardTitle>
            <CardDescription className="text-center">
              Crie sua conta para começar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {registrationSuccess ? (
              <Alert className="bg-green-600/20 border-green-500 text-green-500 mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Conta criada com sucesso! Redirecionando...</AlertDescription>
              </Alert>
            ) : (
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
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Digite seu nome completo"
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
                        <FormLabel>Email</FormLabel>
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
                    label="Senha"
                    autoComplete="new-password"
                  />
                  
                  <PasswordInput
                    form={form}
                    name="confirmPassword"
                    label="Confirme sua senha"
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
                        Criando conta...
                      </>
                    ) : (
                      'Criar conta'
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-zinc-400 w-full">
              Já possui uma conta?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Entre agora!
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
