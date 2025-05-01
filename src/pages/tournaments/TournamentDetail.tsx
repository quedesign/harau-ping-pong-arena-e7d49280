import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatch, useTournament } from '@/contexts/data';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Users, Flag, Timer } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Match } from '@/types';
import { writeData } from '@/integrations/firebase/utils';

const TournamentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { tournament, isLoading, error, fetchSingleTournament, reload } = useTournament();
  const { matches, loading: matchesLoading, error: matchesError } = useMatch();

  const [tournamentMatches, setTournamentMatches] = useState<Match[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (id) fetchSingleTournament(id);
  }, [fetchSingleTournament, id]);

  useEffect(() => {
    if (tournament && matches) {
      const filtered = matches.filter((m) => m.tournamentId === tournament.id);
      setTournamentMatches(filtered);
    }
  }, [tournament, matches]);

  useEffect(() => {
    if (tournament && currentUser) {
      const registered = tournament.registeredParticipants?.includes(currentUser.id) ?? false;
      setIsRegistered(registered);
    }
  }, [tournament, currentUser]);

  const handleRegister = useCallback(async () => {
    if (!currentUser || !tournament || isRegistered) return;

    try {
      await writeData(`tournament_participants/${tournament.id}_${currentUser.id}`, {
        tournamentId: tournament.id,
        athleteId: currentUser.id,
      });

      // if (error) throw error;
      
      setIsRegistered(true);
      reload();
    } catch (err) {
      console.error('Error registering for tournament:', err);
    }
  }, [currentUser, tournament, isRegistered, reload]);

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
          <Button onClick={() => navigate('/tournaments')}>
            {t('tournament.backToTournaments')}
          </Button>
        </div>
      </Layout>
    );
  }

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
              <DetailItem icon={<CalendarDays />} label={t('tournament.startDate')} value={startDateFormatted} />
              <DetailItem icon={<CalendarDays />} label={t('tournament.endDate')} value={endDateFormatted} />
              <DetailItem icon={<MapPin />} label={t('tournament.location')} value={tournament.location} />
              <DetailItem icon={<Users />} label={t('tournament.maxParticipants')} value={tournament.maxParticipants} />
              <DetailItem icon={<Flag />} label={t('tournament.format')} value={tournament.format} />
              <DetailItem icon={<Timer />} label={t('tournament.status')} value={tournament.status} />
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
            ) : matchesError ? (
              <div className="text-center py-4">{t('common.error')}</div>
            ) : tournamentMatches.length > 0 ? (
              <ul>
                {tournamentMatches.map((match) => (
                  <li key={match.id} className="py-2 border-b border-zinc-700">
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

const DetailItem = ({ icon, label, value }: { icon: JSX.Element; label: string; value: string | number }) => (
  <div>
    <div className="flex items-center gap-2 text-zinc-400">
      {icon}
      <span>{label}:</span>
    </div>
    <p>{value}</p>
  </div>
);

export default TournamentDetail;
