
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

interface AppearanceSettingsProps {
  darkMode: boolean;
  onDarkModeChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AppearanceSettings: FC<AppearanceSettingsProps> = ({
  darkMode,
  onDarkModeChange,
  onSubmit,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aparência</CardTitle>
        <CardDescription>
          Personalize a aparência da aplicação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="darkMode">Modo Escuro</Label>
              <div className="text-sm text-muted-foreground">
                Ative o modo escuro para reduzir o cansaço visual.
              </div>
            </div>
            <Switch
              id="darkMode"
              checked={darkMode}
              onCheckedChange={onDarkModeChange}
            />
          </div>
          <Button type="submit">Salvar Alterações</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
