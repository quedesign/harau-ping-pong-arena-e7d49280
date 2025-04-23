
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Calendar, MapPin, DollarSign, Users, Trophy, AlertTriangle, 
  Share2, Clock, Check, Settings
} from 'lucide-react';
import { Tournament, Match } from '@/types';

const TournamentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { tournaments, matches, updateTournament } = useData();
  const { currentUser } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Find tournament and related matches
  const tournament = tournaments.find(t => t.id === id);
  const tournamentMatches = matches.filter(m => m.tournamentId === id);
  
  if (!tournament) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">{t('tournaments.notFound')}</h2>
          <Button onClick={() => navigate('/tournaments')}>{t('common.backToTournaments')}</Button>
        </div>
      </Layout>
    );
  }

  const isAdmin = currentUser?.role === 'admin' && tournament.createdBy === currentUser.id;
  const isRegistered = tournament.registeredParticipants.includes(currentUser?.id || '');
  const isFull = tournament.registeredParticipants.length >= tournament.maxParticipants;
  const canRegister = tournament.status === 'upcoming' && !isRegistered && !isFull && currentUser?.role === 'athlete';

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(t('common.locale', { defaultValue: 'pt-BR' }), {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleRegister = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setIsRegistering(true);
    try {
      // Add current user to registered participants
      await updateTournament(tournament.id, {
        registeredParticipants: [...tournament.registeredParticipants, currentUser.id]
      });
      setRegistrationSuccess(true);
      // Reset the success message after 3 seconds
      setTimeout(() => setRegistrationSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to register:', err);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{tournament.name}</h1>
            <Badge className={`
              ${tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' : ''}
              ${tournament.status === 'ongoing' ? 'bg-green-500/20 text-green-400' : ''}
              ${tournament.status === 'completed' ? 'bg-zinc-500/20 text-zinc-400' : ''}
            `}>
              {t(`tournaments.status.${tournament.status}`)}
            </Badge>
          </div>
          <p className="text-zinc-400">{tournament.description}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            {t('common.back')}
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            {t('common.share')}
          </Button>
          {isAdmin && (
            <Button 
              size="sm"
              onClick={() => navigate(`/admin/tournaments/${tournament.id}/manage`)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {t('admin.manageTournament')}
            </Button>
          )}
        </div>
      </div>

      {registrationSuccess && (
        <Alert className="mb-6 bg-green-500/10 border-green-500/20 text-green-400">
          <Check className="h-4 w-4" />
          <AlertTitle>{t('tournaments.registrationComplete')}</AlertTitle>
          <AlertDescription>
            {t('tournaments.registrationSuccess')}
          </AlertDescription>
        </Alert>
      )}

      {isRegistered && (
        <Alert className="mb-6 bg-blue-500/10 border-blue-500/20 text-blue-400">
          <Check className="h-4 w-4" />
          <AlertTitle>{t('tournaments.youreRegistered')}</AlertTitle>
          <AlertDescription>
            {t('tournaments.checkSchedule')}
          </AlertDescription>
        </Alert>
      )}

      {isFull && !isRegistered && (
        <Alert className="mb-6 bg-orange-500/10 border-orange-500/20 text-orange-400">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('tournaments.tournamentFull')}</AlertTitle>
          <AlertDescription>
            {t('tournaments.maxCapacityReached')}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
          <CardHeader>
            <CardTitle>{t('tournaments.details')}</CardTitle>
            <CardDescription>{t('tournaments.aboutTournament')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 mt-0.5 text-zinc-400" />
                  <div>
                    <p className="font-medium">{t('tournaments.dateTime')}</p>
                    <p className="text-zinc-400 text-sm">
                      {formatDate(tournament.startDate)} to {formatDate(tournament.endDate)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5 text-zinc-400" />
                  <div>
                    <p className="font-medium">{t('tournaments.location')}</p>
                    <p className="text-zinc-400 text-sm">{tournament.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 mr-3 mt-0.5 text-zinc-400" />
                  <div>
                    <p className="font-medium">{t('tournaments.entryFee')}</p>
                    <p className="text-zinc-400 text-sm">
                      {tournament.entryFee > 0 ? `${tournament.entryFee.toLocaleString()} BRL` : t('tournaments.freeEntry')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Trophy className="h-5 w-5 mr-3 mt-0.5 text-zinc-400" />
                  <div>
                    <p className="font-medium">{t('tournaments.format')}</p>
                    <p className="text-zinc-400 text-sm capitalize">
                      {t(`tournaments.formats.${tournament.format}`)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-5 w-5 mr-3 mt-0.5 text-zinc-400" />
                  <div>
                    <p className="font-medium">{t('tournaments.participants')}</p>
                    <p className="text-zinc-400 text-sm">
                      {tournament.registeredParticipants.length} {t('tournaments.registeredOf')} {tournament.maxParticipants} {t('tournaments.maximum')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 mt-0.5 text-zinc-400" />
                  <div>
                    <p className="font-medium">{t('tournaments.registrationDeadline')}</p>
                    <p className="text-zinc-400 text-sm">
                      {formatDate(new Date(tournament.startDate.getTime() - 86400000))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div>
                <h3 className="font-medium mb-1">{t('tournaments.paymentMethod')}</h3>
                <p className="text-zinc-400 text-sm">
                  {tournament.pixKey 
                    ? t('tournaments.paymentViaPix') 
                    : t('tournaments.paymentUponRegistration')}
                </p>
              </div>
              
              {canRegister && (
                <Button 
                  disabled={isRegistering}
                  onClick={handleRegister}
                >
                  {isRegistering ? t('common.processing') : t('tournaments.registerNow')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800 h-fit">
          <CardHeader>
            <CardTitle>{t('tournaments.organizer')}</CardTitle>
            <CardDescription>{t('tournaments.tournamentAdministration')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mr-4">
                <span className="text-lg font-semibold">A</span>
              </div>
              <div>
                <p className="font-medium">{t('admin.adminUser')}</p>
                <p className="text-zinc-400 text-sm">{t('tournaments.tournamentDirector')}</p>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              {t('tournaments.contactOrganizer')}
            </Button>
          </CardContent>
        </Card>
      </div>
      
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
                {tournament.status === 'upcoming' 
                  ? t('tournaments.bracketGeneratedWhenBegins') 
                  : t('tournaments.currentBracket')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-12">
              {tournament.status === 'upcoming' ? (
                <div className="text-center">
                  <Trophy className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
                  <h3 className="text-xl font-medium mb-2">{t('tournaments.bracketNotGenerated')}</h3>
                  <p className="text-zinc-400 max-w-md mx-auto">
                    {t('tournaments.bracketAvailableWhen', { date: formatDate(tournament.startDate) })}
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
                    <MatchItem key={match.id} match={match} />
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
                {tournament.registeredParticipants.length} {t('tournaments.outOf')} {tournament.maxParticipants} {t('tournaments.participants')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tournament.registeredParticipants.length > 0 ? (
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
    </Layout>
  );
};

// Match item component for the matches tab
const MatchItem = ({ match }: { match: Match }) => {
  const { t } = useTranslation();
  
  // Format date function
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(t('common.locale', { defaultValue: 'pt-BR' }), {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Placeholder for player names (in a real app, you would fetch these)
  const playerOneName = t('tournaments.player', { number: 1 });
  const playerTwoName = t('tournaments.player', { number: 2 });

  return (
    <div className="p-4 bg-black rounded-md border border-zinc-800">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-zinc-400">
          {formatDate(match.scheduledTime)}
        </div>
        <Badge className={`
          ${match.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' : ''}
          ${match.status === 'completed' ? 'bg-green-500/20 text-green-400' : ''}
          ${match.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : ''}
        `}>
          {t(`tournaments.matchStatus.${match.status}`)}
        </Badge>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
            {playerOneName.charAt(0)}
          </div>
          <span className={match.winner === match.playerOneId ? 'font-bold' : ''}>
            {playerOneName}
          </span>
        </div>
        
        <div className="text-center">
          <div className="font-medium">
            {match.status === 'completed' ? (
              <span>
                {match.scores.playerOne.join('-')} : {match.scores.playerTwo.join('-')}
              </span>
            ) : (
              <span>vs</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={match.winner === match.playerTwoId ? 'font-bold' : ''}>
            {playerTwoName}
          </span>
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
            {playerTwoName.charAt(0)}
          </div>
        </div>
      </div>
      
      {match.location && (
        <div className="mt-2 text-sm text-zinc-400 flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          {match.location}
        </div>
      )}
    </div>
  );
};

export default TournamentDetail;
