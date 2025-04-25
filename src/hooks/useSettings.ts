
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

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

  useEffect(() => {
    fetchSettings();
  }, [currentUser?.id]);

  const fetchSettings = async () => {
    try {
      // Use localStorage as the source of truth for now
      const storedDarkMode = localStorage.getItem('darkMode') === 'true';
      const storedEmailNotifications = localStorage.getItem('emailNotifications') !== 'false';
      const storedLanguage = localStorage.getItem('userLanguage') || 'pt';
      const storedTimezone = localStorage.getItem('timezone') || 'America/Sao_Paulo';
      
      const userSettings = {
        darkMode: storedDarkMode,
        emailNotifications: storedEmailNotifications,
        language: storedLanguage,
        timezone: storedTimezone,
      };
      
      setSettings(userSettings);
      
      // Update i18n language when settings are loaded
      if (userSettings.language) {
        i18n.changeLanguage(userSettings.language);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Store settings in localStorage
      localStorage.setItem('darkMode', String(settings.darkMode));
      localStorage.setItem('emailNotifications', String(settings.emailNotifications));
      localStorage.setItem('userLanguage', settings.language);
      localStorage.setItem('timezone', settings.timezone);

      // Update i18n language when settings are saved
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
