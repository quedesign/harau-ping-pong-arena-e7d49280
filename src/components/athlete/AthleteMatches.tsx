
import { AthleteMatchesProps } from './types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Swords } from 'lucide-react';

const AthleteMatches: React.FC<AthleteMatchesProps> = ({ athleteId }) => {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Swords className="h-5 w-5 mr-2" />
          Histórico de Partidas
        </CardTitle>
        <CardDescription>
          Partidas recentes e resultados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-zinc-400">
            Nenhum histórico de partidas disponível
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AthleteMatches;
