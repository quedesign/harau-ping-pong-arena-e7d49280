
import { useState, useEffect } from 'react';
import { database } from '@/integrations/firebase/client';
import { ref, get, set } from 'firebase/database';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

interface Settings {
  theme: 'dark' | 'light' | 'system';
  language: 'en' | 'pt';
  notifications: {
    email: boolean;
    browser: boolean;
    mobile: boolean;
  };
}

const defaultSettings: Settings = {
  theme: 'dark',
  language: 'pt',
  notifications: {
    email: true,
    browser: true,
    mobile: false,
  },
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!currentUser) {
        setSettings(defaultSettings);
        setIsLoading(false);
        return;
      }

      try {
        const settingsRef = ref(database, `settings/${currentUser.id}`);
        const snapshot = await get(settingsRef);

        if (snapshot.exists()) {
          setSettings(snapshot.val() as Settings);
        } else {
          // Initialize default settings for new user
          await set(settingsRef, defaultSettings);
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Erro ao carregar configurações');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [currentUser]);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    if (!currentUser) return;

    try {
      const updatedSettings = { ...settings, ...newSettings };
      const settingsRef = ref(database, `settings/${currentUser.id}`);
      await set(settingsRef, updatedSettings);
      setSettings(updatedSettings);
      toast.success('Configurações atualizadas com sucesso');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Erro ao atualizar configurações');
    }
  };

  return {
    settings,
    updateSettings,
    isLoading,
  };
};
