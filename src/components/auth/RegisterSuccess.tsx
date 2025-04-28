
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const RegisterSuccess = () => {
  const { t } = useTranslation();
  
  return (
    <Alert className="bg-green-600/20 border-green-500 text-green-500 mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {t('auth.accountCreated', 'Conta criada com sucesso! Redirecionando...')}
      </AlertDescription>
    </Alert>
  );
};
