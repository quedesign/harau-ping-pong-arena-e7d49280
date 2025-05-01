
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';

interface UserSettings {
  darkMode: boolean;
  emailNotifications: boolean;
}

export const useSettings = () => {
  const localStorageKey = 'user-settings';
  const { toast } = useToast();
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const initialSettings: UserSettings = {
    darkMode: false,
    emailNotifications: true,
  };

  const [settings, setSettings] = useState<UserSettings>(() => {
    const storedSettings = localStorage.getItem(localStorageKey);
    if (storedSettings) {
      return JSON.parse(storedSettings) as UserSettings;
    }
    return initialSettings;
  });

  useEffect(() => {
    const storedSettings = localStorage.getItem(localStorageKey);
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings) as UserSettings;
      setSettings(parsedSettings);
    }
  }, []);

  useEffect(() => {localStorage.setItem(localStorageKey, JSON.stringify(settings))}, [settings]);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
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
