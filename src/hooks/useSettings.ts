
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
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
    if (currentUser?.id) {
      fetchSettings();
    }
  }, [currentUser?.id]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', currentUser?.id)
        .single();

      if (error) throw error;

      if (data) {
        const userSettings = {
          darkMode: data.dark_mode,
          emailNotifications: data.email_notifications,
          language: data.language,
          timezone: data.timezone,
        };
        setSettings(userSettings);
        // Update i18n language when settings are loaded
        if (userSettings.language) {
          i18n.changeLanguage(userSettings.language);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: currentUser.id,
          dark_mode: settings.darkMode,
          email_notifications: settings.emailNotifications,
          language: settings.language,
          timezone: settings.timezone,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

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
