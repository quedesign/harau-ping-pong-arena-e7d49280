
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatch } from '@/contexts/data';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Users, Flag, Timer } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tournament, Match } from '@/types';
import { useTournamentFetch } from '@/hooks/useTournamentFetch';

const TournamentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { tournaments, loading: tournamentsLoading } = useTournament();
  const { tournament: fetchedTournament, isLoading, error: fetchError} = useTournamentFetch(id);
  const { matches, loading: matchesLoading } = useMatch();
  
  const [tournamentMatches, setTournamentMatches] = useState<Match[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  

  useEffect(() => {
    if (fetchedTournament && matches) {
        const filteredMatches = matches.filter(m => m.tournamentId === fetchedTournament.id);
        setTournamentMatches(filteredMatches);
    }
  }, [fetchedTournament, matches, id]);

  useEffect(() => {
    if (fetchedTournament && currentUser) {
      setIsRegistered(fetchedTournament.registeredParticipants.includes(currentUser.id));
    }
  }, [fetchedTournament, currentUser]);

  const tournament = fetchedTournament;
  const error = fetchError;


  if (tournamentsLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">{t('common.loading')}</h2>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">{t('common.loading')}</h2>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">{t('common.error')}</h2>
          <p>{error.message}</p>
        </div>
      </Layout>
    );
  }

  if (!tournament) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">{t('tournament.notFound')}</h2>
          <Button onClick={() => navigate('/tournaments')}>{t('tournament.backToTournaments')}</Button>         
        </div>
      </Layout>
    );
  }

  const handleRegister = () => {
    // Implement registration logic here
    console.log('Registering for tournament:', tournament.id);
  };

  const startDateFormatted = format(new Date(tournament.startDate), 'PPPP', { locale: ptBR });
  const endDateFormatted = format(new Date(tournament.endDate), 'PPPP', { locale: ptBR });

  return (
    <Layout>
      <div className="container max-w-4xl py-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl">{tournament.name}</CardTitle>
            <CardDescription>{tournament.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <CalendarDays className="h-4 w-4" />
                  <span>{t('tournament.startDate')}:</span>
                </div>
                <p>{startDateFormatted}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <CalendarDays className="h-4 w-4" />
                  <span>{t('tournament.endDate')}:</span>
                </div>
                <p>{endDateFormatted}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <MapPin className="h-4 w-4" />
                  <span>{t('tournament.location')}:</span>
                </div>
                <p>{tournament.location}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Users className="h-4 w-4" />
                  <span>{t('tournament.maxParticipants')}:</span>
                </div>
                <p>{tournament.maxParticipants}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Flag className="h-4 w-4" />
                  <span>{t('tournament.format')}:</span>
                </div>
                <p>{tournament.format}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Timer className="h-4 w-4" />
                  <span>{t('tournament.status')}:</span>
                </div>
                <p>{tournament.status}</p>
              </div>
            </div>
            
            {currentUser && (
              <Button onClick={handleRegister} disabled={isRegistered}>
                {isRegistered ? t('tournament.registered') : t('tournament.register')}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6 bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>{t('tournament.matches')}</CardTitle>
            <CardDescription>{t('tournament.upcomingMatches')}</CardDescription>
          </CardHeader>
          <CardContent>
            {matchesLoading ? (
              <div className="text-center py-4">{t('common.loading')}</div>
            ) : error ? (
              <div className="text-center py-4">{t('common.error')}</div>
            ) : tournamentMatches && tournamentMatches.length > 0 ? (
              <ul>
                {tournamentMatches.map((match) => (
                  <li key={match.id} className="py-2 border-b border-zinc-700">
                    {/* Display match details here */}
                    {match.playerOneId} vs {match.playerTwoId}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">{t('tournament.noMatches')}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TournamentDetail;
