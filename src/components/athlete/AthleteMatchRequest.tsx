import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MouseEventHandler } from 'react';

interface AthleteMatchRequestProps {
  isOwnProfile: boolean;
  onViewMatches?: MouseEventHandler<HTMLButtonElement>;
  onRequestMatch?: MouseEventHandler<HTMLButtonElement>;
}

const AthleteMatchRequest: React.FC<AthleteMatchRequestProps> = ({ isOwnProfile, onViewMatches, onRequestMatch }) => {
 return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Agendar uma Partida
        </CardTitle>
        <CardDescription>
          {isOwnProfile
            ? 'Visualize e gerencie solicitações de partidas'
            : 'Envie uma solicitação de partida para este jogador'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isOwnProfile ? (
          <div className="text-center py-8">
            <p className="text-zinc-400 mb-4">
              Você não tem solicitações de partidas pendentes
            </p>
            <Button onClick={onViewMatches}>Ver Histórico de Partidas</Button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-zinc-400">
              Você pode agendar uma partida amistosa com este jogador.
            </p>
            <Button className="w-full" onClick={onRequestMatch}>
              Solicitar uma Partida
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AthleteMatchRequest;