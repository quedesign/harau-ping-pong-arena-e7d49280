
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { RegisterSuccess } from '@/components/auth/RegisterSuccess';
import { useAuth } from '@/contexts/auth';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { currentUser } = useAuth();
  
  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (currentUser) {
      console.log('User already logged in, redirecting to dashboard');
      navigate('/dashboard');
    } else {
      console.log('Redirecionando para a página de registro');
    }
  }, [currentUser, navigate]);
  
  const handleSuccess = () => {
    setRegistrationSuccess(true);
    toast.success("Conta criada com sucesso!");
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };
  
  return (
    <Layout>
      <div className="flex justify-center items-center py-8 px-4">
        <Card className="w-full max-w-md border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {t('auth.registerTitle', 'Faça parte da maior comunidade de tênis de mesa')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('auth.registerSubtitle', 'Crie sua conta para começar')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {registrationSuccess ? (
              <RegisterSuccess />
            ) : (
              <RegisterForm onSuccess={handleSuccess} />
            )}
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-zinc-400 w-full">
              {t('auth.alreadyHaveAccount', 'Já possui uma conta?')}{' '}
              <Link to="/login" className="text-primary hover:underline">
                {t('auth.loginNow', 'Entre agora!')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Register;
