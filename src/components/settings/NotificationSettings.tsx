
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface NotificationSettingsProps {
  emailNotifications: boolean;
  onEmailNotificationsChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const NotificationSettings: FC<NotificationSettingsProps> = ({
  emailNotifications,
  onEmailNotificationsChange,
  onSubmit,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
        <CardDescription>
          Configure suas preferências de notificação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Notificações por Email</Label>
              <div className="text-sm text-muted-foreground">
                Receba atualizações importantes por email.
              </div>
            </div>
            <Switch
              id="emailNotifications"
              checked={emailNotifications}
              onCheckedChange={onEmailNotificationsChange}
            />
          </div>
          <Button type="submit">Salvar Alterações</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
