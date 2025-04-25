import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Bell, Languages, Monitor } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [settings, setSettings] = useState({
    darkMode: false,
    emailNotifications: true,
    language: 'pt',
    timezone: 'America/Sao_Paulo',
  });

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would update user settings in the backend
    localStorage.setItem('userSettings', JSON.stringify(settings));

    toast({
      title: t('common.success'),
      description: 'Configurações atualizadas com sucesso',
    });
  };

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
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                  Personalize a aparência da aplicação.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateSettings} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode">Modo Escuro</Label>
                      <div className="text-sm text-muted-foreground">
                        Ative o modo escuro para reduzir o cansaço visual.
                      </div>
                    </div>
                    <Switch
                      id="darkMode"
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, darkMode: checked })
                      }
                    />
                  </div>
                  <Button type="submit">Salvar Alterações</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                  Configure suas preferências de notificação.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateSettings} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Notificações por Email</Label>
                      <div className="text-sm text-muted-foreground">
                        Receba atualizações importantes por email.
                      </div>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, emailNotifications: checked })
                      }
                    />
                  </div>
                  <Button type="submit">Salvar Alterações</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle>Idioma e Região</CardTitle>
                <CardDescription>
                  Defina suas preferências de idioma e fuso horário.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateSettings} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <select
                      id="language"
                      className="w-full p-2 border rounded-md"
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    >
                      <option value="pt">Português</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <select
                      id="timezone"
                      className="w-full p-2 border rounded-md"
                      value={settings.timezone}
                      onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    >
                      <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                      <option value="America/New_York">Nova Iorque (GMT-5)</option>
                      <option value="Europe/London">Londres (GMT)</option>
                      <option value="Europe/Paris">Paris (GMT+1)</option>
                      <option value="Asia/Tokyo">Tóquio (GMT+9)</option>
                    </select>
                  </div>
                  <Button type="submit">Salvar Alterações</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Configure outras opções gerais da aplicação.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Estas configurações afetam como você interage com o aplicativo.
                </p>
                <Button variant="outline" asChild className="mb-4">
                  <a href="/my-profile">
                    Gerenciar Perfil de Usuário
                  </a>
                </Button>
                <p className="text-sm text-muted-foreground">
                  Versão do app: 1.0.0
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
