
import { FC } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const GeneralSettings: FC = () => {
  return (
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
  );
};

export default GeneralSettings;
