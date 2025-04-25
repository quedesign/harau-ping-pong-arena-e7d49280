
import { useTranslation } from 'react-i18next';
import { Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TournamentMatchItem } from './TournamentMatchItem';
import { Match } from '@/types';

interface TournamentContentProps {
  status: string;
  startDate: Date;
  tournamentMatches: Match[];
  registeredParticipants: string[];
}

export function TournamentContent({ 
  status, 
  startDate,
  tournamentMatches,
  registeredParticipants
}: TournamentContentProps) {
  const { t } = useTranslation();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(t('common.locale', { defaultValue: 'pt-BR' }), {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Tabs defaultValue="bracket" className="mb-8">
      <TabsList className="bg-zinc-900 border-zinc-800">
        <TabsTrigger value="bracket">{t('tournaments.bracket')}</TabsTrigger>
        <TabsTrigger value="matches">{t('tournaments.matches')}</TabsTrigger>
        <TabsTrigger value="participants">{t('tournaments.participants')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="bracket">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>{t('tournaments.tournamentBracket')}</CardTitle>
            <CardDescription>
              {status === 'upcoming' 
                ? t('tournaments.bracketGeneratedWhenBegins') 
                : t('tournaments.currentBracket')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-12">
            {status === 'upcoming' ? (
              <div className="text-center">
                <Trophy className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
                <h3 className="text-xl font-medium mb-2">{t('tournaments.bracketNotGenerated')}</h3>
                <p className="text-zinc-400 max-w-md mx-auto">
                  {t('tournaments.bracketAvailableWhen', { date: formatDate(startDate) })}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-zinc-400">{t('tournaments.bracketVisualization')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="matches">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>{t('tournaments.tournamentMatches')}</CardTitle>
            <CardDescription>
              {tournamentMatches.length > 0 
                ? t('tournaments.scheduleAndResults') 
                : t('tournaments.noMatchesYet')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tournamentMatches.length > 0 ? (
              <div className="space-y-4">
                {tournamentMatches.map((match) => (
                  <TournamentMatchItem key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-zinc-400">
                  {t('tournaments.matchesScheduledWhenBegins')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="participants">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>{t('tournaments.registeredParticipants')}</CardTitle>
            <CardDescription>
              {registeredParticipants.length} {t('tournaments.outOf')} {registeredParticipants.length} {t('tournaments.participants')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {registeredParticipants.length > 0 ? (
              <div className="space-y-4">
                <p className="text-zinc-400">
                  {t('tournaments.participantsList')}
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-zinc-400">
                  {t('tournaments.noParticipantsYet')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
