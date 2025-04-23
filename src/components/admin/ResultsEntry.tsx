import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '@/contexts/DataContext';
import { Tournament, Match } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, FilePen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface ResultsEntryProps {
  tournament: Tournament;
}

const ResultsEntry = ({ tournament }: ResultsEntryProps) => {
  const { t } = useTranslation();
  const { matches, updateMatch, createMatch } = useData();
  const [activeRound, setActiveRound] = useState('1');
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // Filter matches by tournament and round
  const tournamentMatches = matches.filter(m => m.tournamentId === tournament.id);
  const roundMatches = tournamentMatches.filter(m => {
    // This is a simplification. In a real app, matches would have a round property
    const matchId = m.id;
    return matchId.includes(`r${activeRound}-`) || matchId.includes(`-r${activeRound}`);
  });

  // Mock scores for input state
  const [scores, setScores] = useState<Record<string, { playerOne: string[], playerTwo: string[] }>>({});

  const handleScoreChange = (matchId: string, player: 'playerOne' | 'playerTwo', gameIndex: number, value: string) => {
    const scoreValue = value === '' ? '' : parseInt(value) || 0;
    
    setScores(prev => {
      const matchScores = prev[matchId] || { 
        playerOne: Array(3).fill(''), 
        playerTwo: Array(3).fill('') 
      };
      
      const newPlayerScores = [...matchScores[player]];
      newPlayerScores[gameIndex] = value;
      
      return {
        ...prev,
        [matchId]: {
          ...matchScores,
          [player]: newPlayerScores
        }
      };
    });
  };

  const handleSaveResult = async (match: Match) => {
    const matchId = match.id;
    const matchScores = scores[matchId] || { playerOne: Array(3).fill(''), playerTwo: Array(3).fill('') };
    
    // Validate scores
    const playerOneScores = matchScores.playerOne
      .filter(s => s !== '')
      .map(s => parseInt(s));
      
    const playerTwoScores = matchScores.playerTwo
      .filter(s => s !== '')
      .map(s => parseInt(s));
    
    if (playerOneScores.length === 0 || playerTwoScores.length === 0) {
      toast({
        title: t('admin.invalidScores'),
        description: t('admin.enterScoresForBothPlayers'),
        variant: 'destructive',
      });
      return;
    }
    
    if (playerOneScores.length !== playerTwoScores.length) {
      toast({
        title: t('admin.mismatchedGames'),
        description: t('admin.sameNumberOfGames'),
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(prev => ({ ...prev, [matchId]: true }));
    
    try {
      // Calculate winner
      let playerOneWins = 0;
      let playerTwoWins = 0;
      
      for (let i = 0; i < playerOneScores.length; i++) {
        if (playerOneScores[i] > playerTwoScores[i]) playerOneWins++;
        else if (playerTwoScores[i] > playerOneScores[i]) playerTwoWins++;
      }
      
      const winner = playerOneWins > playerTwoWins ? match.playerOneId : match.playerTwoId;
      
      // Update match
      await updateMatch(matchId, {
        scores: {
          playerOne: playerOneScores,
          playerTwo: playerTwoScores
        },
        winner,
        status: 'completed'
      });
      
      // In a real app, you'd also create the next round match if needed
      if (parseInt(activeRound) < 3) { // Simplified example
        const nextRound = parseInt(activeRound) + 1;
        const nextMatchId = `${tournament.id}-r${nextRound}-m1`;
        
        // Check if next match exists
        const nextMatchExists = matches.some(m => m.id === nextMatchId);
        
        if (!nextMatchExists) {
          // FIX: Remove the id property from the match object since createMatch expects Omit<Match, "id">
          await createMatch({
            tournamentId: tournament.id,
            playerOneId: winner,
            playerTwoId: 'TBD', // This would be determined by another match
            scores: {
              playerOne: [],
              playerTwo: []
            },
            scheduledTime: new Date(),
            status: 'scheduled'
          });
        }
      }
      
      toast({
        title: t('admin.resultSaved'),
        description: t('admin.resultSavedSuccess'),
      });
    } catch (error) {
      console.error("Error saving result:", error);
      toast({
        title: t('common.error'),
        description: t('admin.resultSaveError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, [matchId]: false }));
    }
  };

  const renderScoreInputs = (match: Match) => {
    const matchId = match.id;
    const matchScores = scores[matchId] || { 
      playerOne: Array(3).fill(''), 
      playerTwo: Array(3).fill('') 
    };
    
    return (
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[0, 1, 2].map((gameIndex) => (
          <div key={gameIndex} className="flex flex-col items-center gap-2">
            <span className="text-xs text-zinc-400">{t('admin.game')} {gameIndex + 1}</span>
            <Input
              type="number"
              min="0"
              className="text-center w-16"
              value={matchScores.playerOne[gameIndex] || ''}
              onChange={(e) => handleScoreChange(matchId, 'playerOne', gameIndex, e.target.value)}
              disabled={match.status === 'completed' || loading[matchId]}
            />
            <Input
              type="number"
              min="0"
              className="text-center w-16"
              value={matchScores.playerTwo[gameIndex] || ''}
              onChange={(e) => handleScoreChange(matchId, 'playerTwo', gameIndex, e.target.value)}
              disabled={match.status === 'completed' || loading[matchId]}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>{t('admin.enterMatchResults')}</CardTitle>
        <CardDescription>
          {t('admin.recordScoresAdvancePlayers')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="1" value={activeRound} onValueChange={setActiveRound}>
          <TabsList className="bg-black mb-6">
            <TabsTrigger value="1">{t('admin.round')} 1</TabsTrigger>
            <TabsTrigger value="2">{t('admin.round')} 2</TabsTrigger>
            <TabsTrigger value="3">{t('admin.finals')}</TabsTrigger>
          </TabsList>
          
          {['1', '2', '3'].map(round => (
            <TabsContent key={round} value={round}>
              {roundMatches.length > 0 ? (
                <div className="space-y-4">
                  {roundMatches.map((match) => (
                    <div 
                      key={match.id} 
                      className="p-4 bg-black border border-zinc-800 rounded-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">
                          {`Atleta ${match.playerOneId}`}
                        </div>
                        <Badge className={`
                          ${match.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' : ''}
                          ${match.status === 'completed' ? 'bg-green-500/20 text-green-400' : ''}
                        `}>
                          {match.status === 'scheduled' ? t('admin.pending') : t('admin.completed')}
                        </Badge>
                        <div className="font-medium">
                          {`Atleta ${match.playerTwoId}`}
                        </div>
                      </div>
                      
                      {renderScoreInputs(match)}
                      
                      <div className="flex justify-end mt-4">
                        {match.status === 'completed' ? (
                          <div className="text-sm text-zinc-400">
                            {t('admin.winner')}: {
                              match.winner === match.playerOneId 
                                ? `Atleta ${match.playerOneId}` 
                                : `Atleta ${match.playerTwoId}`
                            }
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleSaveResult(match)}
                            disabled={loading[match.id]}
                          >
                            <FilePen className="h-4 w-4 mr-2" />
                            {loading[match.id] ? t('common.saving') : t('admin.saveResult')}
                          </Button>
                        )}
                      </div>
                      
                      {match.status === 'completed' && parseInt(round) < 3 && (
                        <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
                          <div className="text-sm text-zinc-400">
                            {t('admin.advanceToNextRound')}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setActiveRound((parseInt(round) + 1).toString());
                            }}
                          >
                            {t('admin.nextRound')}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <FilePen className="h-16 w-16 mx-auto text-zinc-700 mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    {t('admin.noMatchesForRound')}
                  </h3>
                  <p className="text-zinc-400 max-w-md mx-auto">
                    {parseInt(round) === 1
                      ? t('admin.generateBracketFirst')
                      : t('admin.completeEarlierRounds')}
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResultsEntry;
