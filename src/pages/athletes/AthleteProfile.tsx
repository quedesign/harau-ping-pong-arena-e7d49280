import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';
import Layout from '@/components/layout/Layout'
import { useAthlete } from '@/contexts/data/athlete';
import AthleteProfileHeader from '@/components/athlete/AthleteProfileHeader';
import { Tabs, TabsContent, TabsTrigger, TabsListProps, TabsList } from '@/components/ui/tabs';
import { AthleteProfile as AthleteProfileType, Tournament } from '@/types';
import AthleteMatches from '@/components/athlete/AthleteMatches'
import { useMatchFetch } from '@/hooks/useMatchFetch';
import AthleteStats, { AthleteStatsData } from '@/components/athlete/AthleteStats';
import AthleteTournaments from '@/components/athlete/AthleteTournaments';
import AthleteProfileCard from '@/components/athlete/AthleteProfileCard';
import AthleteMatchRequest from '@/components/athlete/AthleteMatchRequest';
 
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
  </div>
);



const AthleteProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate()
  const { currentUser } = useAuth();
  const { data: athlete, isLoading: isAthleteLoading } = useAthlete(id);
  const { matches: athleteMatches, isLoading: isMatchesLoading } = useMatchFetch({ 
    playerOneId: id, 
    playerTwoId: id 
  });
  const { t } = useTranslation();
  
  useEffect(() => {
    if (!id) {
      navigate('/athletes');
    }
  }, [id, navigate]);

  if (isAthleteLoading || !athlete) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  const { profile } = athlete;

  if (!profile) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]" >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const athleteName = `Player ${profile.userId}`;
  const isOwnProfile = currentUser?.id === athlete.id;

  const stats: AthleteStatsData = {
    totalMatches: profile.wins + profile.losses,
    tournamentsPlayed: 3,
    longestStreak: "4 vitórias",
    winRate:
      profile.wins + profile.losses > 0
        ? Math.round((profile.wins / (profile.wins + profile.losses)) * 100)
        : 0,
    averagePointsPerGame: 9.3,
    bestTournament: "Semi-finalista",
  };

  const tournaments: Tournament[] = [
    {
      id: "1",
      name: "Torneio A",
      date: new Date(2024, 9, 10),
      result: "Finalista",
    },
    {
      id: "2",
      name: "Torneio B",
      date: new Date(2024, 10, 11),
      result: "Semi-finalista",
    },
    { id: "3", name: "Torneio C", date: new Date(2024, 11, 12), result: "Quartas de final" },
  ];

  const handleViewMatches = () => {
    alert('View Matches');
  };

  const handleRequestMatch = () => {
    alert('Request Match');
  };

  const handleConnect = () => {
    alert('Connect');
  };

  return (
    <Layout>
      <AthleteProfileHeader athleteName={athleteName} bio={profile.bio} isOwnProfile={isOwnProfile} userId={id} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AthleteProfileCard profile={profile} athleteName={athleteName} />
        
        <div className="md:col-span-2">
          <Tabs defaultValue="stats" className="mb-8">
            <TabsList className="bg-zinc-900 border-zinc-800" >
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              <TabsTrigger value="matches">Histórico de Partidas</TabsTrigger>
              <TabsTrigger value="tournaments">Torneios</TabsTrigger>
            </TabsList>
            <TabsContent value="stats">
              <AthleteStats stats={stats} />
            </TabsContent>
            <TabsContent value="matches">
              <AthleteMatches athleteMatches={athleteMatches} id={id} />
            </TabsContent>

            <TabsContent value="tournaments">
              <AthleteTournaments tournaments={tournaments} />
            </TabsContent>
            
          </Tabs>

          <AthleteMatchRequest isOwnProfile={isOwnProfile} onViewMatches={handleViewMatches} onRequestMatch={handleRequestMatch} />



        </div>
      </div>
    </Layout>
  );
};

export default AthleteProfile;
