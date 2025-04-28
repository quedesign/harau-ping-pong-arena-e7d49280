
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';

interface UserSettings {
  darkMode: boolean;
  emailNotifications: boolean;
  language: string;
  timezone: string;
}

export const useSettings = () => {
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: false,
    emailNotifications: true,
    language: 'pt',
    timezone: 'America/Sao_Paulo',
  });

  // Remove localStorage persistence
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update i18n language without persisting
      if (settings.language) {
        i18n.changeLanguage(settings.language);
      }

      toast({
        title: t('common.success'),
        description: t('settings.updateSuccess'),
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: t('common.error'),
        description: t('settings.updateError'),
        variant: 'destructive',
      });
    }
  };

  return {
    settings,
    setSettings,
    handleUpdateSettings,
  };
};
