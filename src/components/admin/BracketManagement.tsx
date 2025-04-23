
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '@/contexts/DataContext';
import { Tournament, Bracket } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dices, AlertTriangle } from 'lucide-react';

interface BracketManagementProps {
  tournament: Tournament;
}

const BracketManagement = ({ tournament }: BracketManagementProps) => {
  const { t } = useTranslation();
  const { generateBracket } = useData();
  const [loading, setLoading] = useState(false);
  const [bracket, setBracket] = useState<Bracket | null>(null);
  const [shuffled, setShuffled] = useState(false);

  const handleGenerateBracket = async () => {
    setLoading(true);
    try {
      // In a real app, you would send a request to generate the bracket
      const generatedBracket = await generateBracket(tournament.id);
      setBracket(generatedBracket);
      setShuffled(true);
      
      toast({
        title: t('admin.bracketGenerated'),
        description: t('admin.bracketGeneratedSuccess'),
      });
    } catch (error) {
      console.error("Error generating bracket:", error);
      toast({
        title: t('common.error'),
        description: t('admin.bracketGenerationError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderBracketPreview = () => {
    if (!bracket || bracket.rounds.length === 0) return null;

    return (
      <div className="mt-6 p-4 bg-black rounded-lg border border-zinc-800">
        <h3 className="font-medium mb-4">{t('admin.bracketPreview')}</h3>
        
        <div className="space-y-6">
          {bracket.rounds.map((round) => (
            <div key={round.roundNumber}>
              <h4 className="text-sm font-medium mb-3">
                {round.roundNumber === 1 ? t('admin.firstRound') : `${t('admin.round')} ${round.roundNumber}`}
              </h4>
              
              <div className="space-y-2">
                {round.matches.map((match) => (
                  <div 
                    key={match.id} 
                    className="p-3 bg-zinc-900 border border-zinc-800 rounded-md"
                  >
                    <div className="flex justify-between items-center">
                      <div>{`Atleta ${match.playerOneId}`}</div>
                      <div className="text-zinc-400">vs</div>
                      <div>{`Atleta ${match.playerTwoId}`}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>{t('admin.bracketManagement')}</CardTitle>
        <CardDescription>
          {t('admin.generateAndViewBracket')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert 
          className={`mb-6 ${
            shuffled 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-yellow-500/10 border-yellow-500/20'
          }`}
        >
          {shuffled ? (
            <>
              <Dices className="h-4 w-4 text-green-500" />
              <AlertTitle>{t('admin.bracketReady')}</AlertTitle>
              <AlertDescription>
                {t('admin.bracketReadyDescription')}
              </AlertDescription>
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <AlertTitle>{t('admin.bracketNotGenerated')}</AlertTitle>
              <AlertDescription>
                {t('admin.bracketNotGeneratedDescription')}
              </AlertDescription>
            </>
          )}
        </Alert>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium">{t('admin.generateBracket')}</h3>
            <p className="text-sm text-zinc-400">
              {t('admin.drawingProcess')}
            </p>
          </div>
          <Button 
            onClick={handleGenerateBracket} 
            disabled={loading}
          >
            <Dices className="h-4 w-4 mr-2" />
            {loading ? t('admin.generating') : t('admin.generateNow')}
          </Button>
        </div>
        
        <Separator className="my-6" />
        
        {shuffled ? renderBracketPreview() : (
          <div className="py-12 text-center">
            <Dices className="h-16 w-16 mx-auto text-zinc-700 mb-4" />
            <h3 className="text-xl font-medium mb-2">
              {t('admin.bracketNotCreatedYet')}
            </h3>
            <p className="text-zinc-400 max-w-md mx-auto">
              {t('admin.clickGenerateToCreate')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BracketManagement;
