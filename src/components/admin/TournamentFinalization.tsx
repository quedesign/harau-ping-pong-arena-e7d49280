
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '@/contexts/DataContext';
import { Tournament, Match } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Trophy, Flag, Medal } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface TournamentFinalizationProps {
  tournament: Tournament;
  onFinalize: () => void;
}

interface PlayerStats {
  playerId: string;
  wins: number;
  matchesPlayed: number;
  furthestRound: number;
  winPercentage: number;
}

const TournamentFinalization = ({ tournament, onFinalize }: TournamentFinalizationProps) => {
  const { t } = useTranslation();
  const { matches } = useData();
  const [loading, setLoading] = useState(false);
  
  // Calculate results based on matches
  const tournamentMatches = matches.filter(m => m.tournamentId === tournament.id && m.status === 'completed');
  
  // Calculate player stats
  const playerStats = tournament.registeredParticipants.reduce((acc, playerId) => {
    const playerMatches = tournamentMatches.filter(
      m => m.playerOneId === playerId || m.playerTwoId === playerId
    ) as Match[];
    
    const wins = playerMatches.filter(m => m.winner === playerId).length;
    const matchesPlayed = playerMatches.length;
    
    let furthestRound = 0;
    playerMatches.forEach(match => {
      // Simplified: extract round number from match ID
      const matchId = match.id;
      const roundMatch = matchId.match(/r(\d+)/);
      if (roundMatch) {
        const round = parseInt(roundMatch[1]);
        furthestRound = Math.max(furthestRound, round);
      }
    });
    
    return {
      ...acc,
      [playerId]: {
        playerId,
        wins,
        matchesPlayed,
        furthestRound,
        winPercentage: matchesPlayed > 0 ? Math.round((wins / matchesPlayed) * 100) : 0
      }
    };
  }, {} as Record<string, PlayerStats>);
  
  // Sort players by: furthest round > wins > win percentage
  const standings = Object.values(playerStats).sort((a: PlayerStats, b: PlayerStats) => {
    if (a.furthestRound !== b.furthestRound) return b.furthestRound - a.furthestRound;
    if (a.wins !== b.wins) return b.wins - a.wins;
    return b.winPercentage - a.winPercentage;
  });
  
  const handleFinalizeTournament = async () => {
    setLoading(true);
    try {
      // In a real app, you would call an API to finalize the tournament
      // and generate the final results/rankings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      onFinalize();
      
      toast({
        title: t('admin.tournamentFinalized'),
        description: t('admin.tournamentFinalizedSuccess'),
      });
    } catch (error) {
      console.error("Error finalizing tournament:", error);
      toast({
        title: t('common.error'),
        description: t('admin.finalizationError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>{t('admin.tournamentFinalization')}</CardTitle>
        <CardDescription>
          {t('admin.reviewAndFinalizeResults')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="font-medium mb-4">{t('admin.finalStandings')}</h3>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">{t('admin.rank')}</TableHead>
                <TableHead>{t('admin.athlete')}</TableHead>
                <TableHead className="text-right">{t('admin.played')}</TableHead>
                <TableHead className="text-right">{t('admin.wins')}</TableHead>
                <TableHead className="text-right">{t('admin.winPercentage')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map((player, index) => (
                <TableRow key={player.playerId}>
                  <TableCell className="font-medium">
                    {index === 0 && <Trophy className="h-4 w-4 text-yellow-500 inline mr-2" />}
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    {`Atleta ${player.playerId}`}
                    {index < 3 && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400">
                        {index === 0 ? t('admin.gold') : index === 1 ? t('admin.silver') : t('admin.bronze')}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{player.matchesPlayed}</TableCell>
                  <TableCell className="text-right">{player.wins}</TableCell>
                  <TableCell className="text-right">{player.winPercentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col items-center py-6">
          <Trophy className="h-16 w-16 text-yellow-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">
            {tournament.status === 'completed' 
              ? t('admin.tournamentIsComplete') 
              : t('admin.readyToFinalize')}
          </h3>
          <p className="text-zinc-400 text-center mb-6 max-w-md">
            {tournament.status === 'completed' 
              ? t('admin.tournamentCompleteDescription') 
              : t('admin.finalizeDescription')}
          </p>
          
          {tournament.status !== 'completed' && (
            <Button 
              onClick={handleFinalizeTournament}
              disabled={loading}
              size="lg"
            >
              <Flag className="h-4 w-4 mr-2" />
              {loading ? t('common.processing') : t('admin.finalizeTournament')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentFinalization;
