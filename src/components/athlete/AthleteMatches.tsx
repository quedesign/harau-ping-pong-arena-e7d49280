import { Match } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface AthleteMatchesProps {
  athleteMatches: Match[];
  id: string;
}

const formatOpponentName = (match: Match, id: string): string => {
  const playerOne = match.playerOneId === id ? 'Você' : 'Oponente';
  const playerTwo = match.playerTwoId === id ? 'Você' : 'Oponente';

  return `${playerOne} vs. ${playerTwo}`;
};

const formatMatchStatus = (match: Match, id: string): string => {
  if (match.status === 'completed') {
    return match.winner === id ? 'Vitória' : 'Derrota';
  } else {
    return match.status === 'scheduled' ? 'Agendada' : 'Cancelada';
  }
};


const AthleteMatches = ({ athleteMatches, id }: AthleteMatchesProps) => {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Histórico de Partidas
        </CardTitle>
        <CardDescription>
          Partidas recentes e resultados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {athleteMatches.length > 0 ? (
          <div className="space-y-4">
            {athleteMatches.map((match) => (
              <div key={match.id} className="flex justify-between items-center p-3 bg-black rounded-md border border-zinc-800">
                <div>
                  <p className="font-medium">
                    {formatOpponentName(match, id)}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {match.scheduledTime.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-sm">
                  {formatMatchStatus(match, id) === "Vitória" || formatMatchStatus(match, id) === "Derrota" ? (
                    <Badge className={`
                      ${formatMatchStatus(match, id) === "Vitória" ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {formatMatchStatus(match, id)}
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-500/20 text-blue-400">
                      {match.status === 'scheduled' ? 'Agendada' : 'Cancelada'}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-zinc-400">
              Nenhum histórico de partidas disponível
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AthleteMatches;