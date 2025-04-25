
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

interface UserSettings {
  darkMode: boolean;
  emailNotifications: boolean;
  language: string;
  timezone: string;
}

export const useSettings = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: false,
    emailNotifications: true,
    language: 'pt',
    timezone: 'America/Sao_Paulo',
  });

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userSettings', JSON.stringify(settings));
    toast({
      title: t('common.success'),
      description: 'Configurações atualizadas com sucesso',
    });
  };

  return {
    settings,
    setSettings,
    handleUpdateSettings,
  };
};
