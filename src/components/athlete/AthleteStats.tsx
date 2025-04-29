import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';

interface AthleteStatsData {
  totalMatches: number;
  tournamentsPlayed: number;
  longestStreak: string;
  winRate: number;
  averagePointsPerGame: number;
  bestTournament: string;
}

interface AthleteStatsProps {
  stats: AthleteStatsData;
}

const AthleteStats = ({ stats }: AthleteStatsProps) => {
  const { totalMatches = 0, tournamentsPlayed = 0, longestStreak = '0 vitórias', winRate = 0, averagePointsPerGame = 0.0, bestTournament = 'N/A' } = stats;
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart className="h-5 w-5 mr-2" />
          Estatísticas de Desempenho 
        </CardTitle>
        <CardDescription>
          Estatísticas detalhadas deste atleta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Total de Partidas: </span>
              <span className="font-medium">{totalMatches}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Torneios Participados:</span>
              <span className="font-medium">{tournamentsPlayed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Maior Sequência:</span>
              <span className="font-medium">{longestStreak}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Taxa de Vitória:</span>
              <span className="font-medium">{winRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Média de Pontos por Jogo:</span>
              <span className="font-medium">{averagePointsPerGame}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Melhor Torneio:</span>
              <span className="font-medium">{bestTournament}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center py-8">
          <p className="text-zinc-400">
            Gráficos detalhados de desempenho aparecerão aqui
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AthleteStats;