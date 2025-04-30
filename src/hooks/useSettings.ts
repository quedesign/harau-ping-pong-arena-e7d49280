
import { useState, useEffect } from 'react';
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
  const localStorageKey = 'user-settings';
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();

  const initialSettings: UserSettings = {
    darkMode: false,
    emailNotifications: true,
    language: i18n.language || 'pt',
    timezone: 'America/Sao_Paulo',
  };

  const [settings, setSettings] = useState<UserSettings>(() => {
    const storedSettings = localStorage.getItem(localStorageKey);
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings) as UserSettings;
      i18n.changeLanguage(parsedSettings.language);
      return parsedSettings;
    }
    return initialSettings;
  });

  useEffect(() => {
    const storedSettings = localStorage.getItem(localStorageKey);
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings) as UserSettings;
      setSettings(parsedSettings);
    }
    i18n.changeLanguage(settings.language);
    
  }, []);

  useEffect(() => {localStorage.setItem(localStorageKey, JSON.stringify(settings))}, [settings]);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update i18n language
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
