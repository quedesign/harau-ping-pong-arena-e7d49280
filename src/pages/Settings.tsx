
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Bell, Monitor } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import GeneralSettings from '@/components/settings/GeneralSettings';

const Settings = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { settings, updateSettings, isLoading } = useSettings();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleDarkModeChange = (checked: boolean) => {
    updateSettings({ theme: checked ? 'dark' : 'light' });
  };

  const handleNotificationsChange = (checked: boolean) => {
    updateSettings({ 
      notifications: { 
        email: checked, 
        browser: settings.notifications?.browser || false, 
        mobile: settings.notifications?.mobile || false 
      } 
    });
  };

  const handleSubmit = () => {
    // This is just a placeholder since the components expect an onSubmit prop
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
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
            <TabsTrigger value="general">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Geral
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance">
            <AppearanceSettings
              darkMode={settings.theme === 'dark'}
              onDarkModeChange={handleDarkModeChange}
              onSubmit={handleSubmit}
            />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings
              emailNotifications={settings.notifications?.email || false}
              onEmailNotificationsChange={handleNotificationsChange}
              onSubmit={handleSubmit}
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
