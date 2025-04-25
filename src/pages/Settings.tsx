
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Bell, Languages, Monitor } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import LanguageSettings from '@/components/settings/LanguageSettings';
import GeneralSettings from '@/components/settings/GeneralSettings';

const Settings = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { settings, setSettings, handleUpdateSettings } = useSettings();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <Layout>
      <div className="container max-w-4xl py-6">
        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="appearance">
              <Monitor className="h-4 w-4 mr-2" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="language">
              <Languages className="h-4 w-4 mr-2" />
              Idioma
            </TabsTrigger>
            <TabsTrigger value="general">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Geral
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance">
            <AppearanceSettings
              darkMode={settings.darkMode}
              onDarkModeChange={(checked) => 
                setSettings({ ...settings, darkMode: checked })
              }
              onSubmit={handleUpdateSettings}
            />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings
              emailNotifications={settings.emailNotifications}
              onEmailNotificationsChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
              onSubmit={handleUpdateSettings}
            />
          </TabsContent>

          <TabsContent value="language">
            <LanguageSettings
              language={settings.language}
              timezone={settings.timezone}
              onLanguageChange={(value) =>
                setSettings({ ...settings, language: value })
              }
              onTimezoneChange={(value) =>
                setSettings({ ...settings, timezone: value })
              }
              onSubmit={handleUpdateSettings}
            />
          </TabsContent>

          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
