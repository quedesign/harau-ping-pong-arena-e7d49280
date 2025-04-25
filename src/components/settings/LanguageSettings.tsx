
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface LanguageSettingsProps {
  language: string;
  timezone: string;
  onLanguageChange: (value: string) => void;
  onTimezoneChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LanguageSettings: FC<LanguageSettingsProps> = ({
  language,
  timezone,
  onLanguageChange,
  onTimezoneChange,
  onSubmit,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Idioma e Região</CardTitle>
        <CardDescription>
          Defina suas preferências de idioma e fuso horário.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <select
              id="language"
              className="w-full p-2 border rounded-md"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
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
              value={timezone}
              onChange={(e) => onTimezoneChange(e.target.value)}
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
  );
};

export default LanguageSettings;
