
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Share2, Clock, Check 
} from 'lucide-react';
import { Tournament, Match } from '@/types';

const TournamentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
          <h2 className="text-2xl font-bold mb-4">Tournament not found</h2>
          <Button onClick={() => navigate('/tournaments')}>Back to Tournaments</Button>
        </div>
      </Layout>
    );
  }

  const isAdmin = currentUser?.role === 'admin' && tournament.createdBy === currentUser.id;
  const isRegistered = tournament.registeredParticipants.includes(currentUser?.id || '');
  const isFull = tournament.registeredParticipants.length >= tournament.maxParticipants;
  const canRegister = tournament.status === 'upcoming' && !isRegistered && !isFull && currentUser?.role === 'athlete';

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
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
              {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
            </Badge>
          </div>
          <p className="text-zinc-400">{tournament.description}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            Back
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          {isAdmin && (
            <Button 
              size="sm"
              onClick={() => navigate(`/admin/tournaments/${tournament.id}/edit`)}
            >
              Edit Tournament
            </Button>
          )}
        </div>
      </div>

      {registrationSuccess && (
        <Alert className="mb-6 bg-green-500/10 border-green-500/20 text-green-400">
          <Check className="h-4 w-4" />
          <AlertTitle>Registration Complete!</AlertTitle>
          <AlertDescription>
            You've successfully registered for this tournament.
          </AlertDescription>
        </Alert>
      )}

      {isRegistered && (
        <Alert className="mb-6 bg-blue-500/10 border-blue-500/20 text-blue-400">
          <Check className="h-4 w-4" />
          <AlertTitle>You're Registered</AlertTitle>
          <AlertDescription>
            You're already registered for this tournament. Check below for schedule and bracket information.
          </AlertDescription>
        </Alert>
      )}

      {isFull && !isRegistered && (
        <Alert className="mb-6 bg-orange-500/10 border-orange-500/20 text-orange-400">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Tournament Full</AlertTitle>
          <AlertDescription>
            This tournament has reached its maximum capacity of participants.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
          <CardHeader>
            <CardTitle>Tournament Details</CardTitle>
            <CardDescription>Information about this tournament</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 mt-0.5 text-zinc-400" />
                  <div>
                    <p className="font-medium">Date and Time</p>
                    <p className="text-zinc-400 text-sm">
                      {formatDate(tournament.startDate)} to {formatDate(tournament.endDate)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5 text-zinc-400" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-zinc-400 text-sm">{tournament.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 mr-3 mt-0.5 text-zinc-400" />
                  <div>
                    <p className="font-medium">Entry Fee</p>
                    <p className="text-zinc-400 text-sm">
                      {tournament.entryFee > 0 ? `${tournament.entryFee.toLocaleString()} BRL` : 'Free Entry'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Trophy className="h-5 w-5 mr-3 mt-0.5 text-zinc-400" />
                  <div>
                    <p className="font-medium">Tournament Format</p>
                    <p className="text-zinc-400 text-sm capitalize">
                      {tournament.format} Tournament
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-5 w-5 mr-3 mt-0.5 text-zinc-400" />
                  <div>
                    <p className="font-medium">Participants</p>
                    <p className="text-zinc-400 text-sm">
                      {tournament.registeredParticipants.length} registered out of {tournament.maxParticipants} maximum
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 mt-0.5 text-zinc-400" />
                  <div>
                    <p className="font-medium">Registration Deadline</p>
                    <p className="text-zinc-400 text-sm">
                      {formatDate(new Date(tournament.startDate.getTime() - 86400000))} (1 day before start)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div>
                <h3 className="font-medium mb-1">Payment Method</h3>
                <p className="text-zinc-400 text-sm">
                  Payment via PIX upon registration approval
                </p>
              </div>
              
              {canRegister && (
                <Button 
                  disabled={isRegistering}
                  onClick={handleRegister}
                >
                  {isRegistering ? 'Registering...' : 'Register Now'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800 h-fit">
          <CardHeader>
            <CardTitle>Organizer</CardTitle>
            <CardDescription>Tournament administration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mr-4">
                <span className="text-lg font-semibold">A</span>
              </div>
              <div>
                <p className="font-medium">Admin User</p>
                <p className="text-zinc-400 text-sm">Tournament Director</p>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              Contact Organizer
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="bracket" className="mb-8">
        <TabsList className="bg-zinc-900 border-zinc-800">
          <TabsTrigger value="bracket">Bracket</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bracket">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Tournament Bracket</CardTitle>
              <CardDescription>
                {tournament.status === 'upcoming' 
                  ? 'The bracket will be generated once the tournament begins' 
                  : 'Current tournament bracket and progression'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-12">
              {tournament.status === 'upcoming' ? (
                <div className="text-center">
                  <Trophy className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Bracket Not Generated Yet</h3>
                  <p className="text-zinc-400 max-w-md mx-auto">
                    The tournament bracket will be available once all registrations are confirmed 
                    and the tournament begins. Check back on {formatDate(tournament.startDate)}.
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-zinc-400">Bracket visualization will be displayed here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="matches">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Tournament Matches</CardTitle>
              <CardDescription>
                {tournamentMatches.length > 0 
                  ? 'Schedule and results of all tournament matches' 
                  : 'No matches scheduled yet'}
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
                    Matches will be scheduled once the tournament begins
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="participants">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Registered Participants</CardTitle>
              <CardDescription>
                {tournament.registeredParticipants.length} out of {tournament.maxParticipants} participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tournament.registeredParticipants.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-zinc-400">
                    List of registered participants will be displayed here
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-zinc-400">
                    No participants have registered for this tournament yet
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
  // Format date function
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Placeholder for player names (in a real app, you would fetch these)
  const playerOneName = "Player 1";
  const playerTwoName = "Player 2";

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
          {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
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
