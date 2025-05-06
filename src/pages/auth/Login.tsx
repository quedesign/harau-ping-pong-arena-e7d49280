
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/auth';
import { loginSchema, LoginFormValues } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';

const Login = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/dashboard';
  const { currentUser, isLoading } = useAuth();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Redirect if user is already logged in
  React.useEffect(() => {
    if (currentUser && !isLoading) {
      navigate(from);
    }
  }, [currentUser, isLoading, navigate, from]);

  return (
    <Layout>
      <div className="flex justify-center items-center py-8 px-4">
        <Card className="w-full max-w-md border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t('auth.loginTitle', 'Bem vindo de volta!')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('auth.loginSubtitle', 'Faça login na sua conta')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...form}>
              <LoginForm />
            </FormProvider>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-zinc-400 w-full">
              {t('auth.dontHaveAccount', 'Não possui uma conta?')}
              {' '}
              <Link to="/register" className="text-primary hover:underline">
                {t('auth.registerNow', 'Cadastre-se agora!')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
