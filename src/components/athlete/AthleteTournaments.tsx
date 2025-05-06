
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { AthleteTournamentsProps } from './types';

interface Tournament {
  id: string;
  name: string;
  date: Date;
  result: string;
}

const AthleteTournaments: React.FC<AthleteTournamentsProps> = ({ athleteId, tournaments = [] }) => {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 mr-2" />
          Participação em Torneios
        </CardTitle> 
        <CardDescription>
          Torneios e conquistas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tournaments.length > 0 ? (
          <div className="space-y-4">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="p-3 bg-black rounded-md border border-zinc-800">
                  <p>
                    <strong>{tournament.name}</strong> - {tournament.result} - {tournament.date.toLocaleDateString()}
                  </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-zinc-400">
              Nenhum histórico de torneios disponível
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AthleteTournaments;
