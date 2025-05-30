
import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import RecentAthletes from '@/components/athletes/RecentAthletes';
import FollowingAthletes from '@/components/athletes/FollowingAthletes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Calendar, Users } from 'lucide-react';
import UpcomingTournaments from '@/components/tournaments/UpcomingTournaments';
import { useAthlete } from '@/contexts/data/athlete';
import { useTournament } from '@/contexts/data/TournamentContext';
import { useFollowing } from '@/hooks/useFollowing';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { athleteProfiles } = useAthlete();
  const { tournaments } = useTournament();
  const { followingCount } = useFollowing(currentUser?.id);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Calculate statistics for the cards
  const participatedTournaments = tournaments?.filter(t => 
    t.registeredParticipants?.includes(currentUser?.id || '')
  )?.length || 0;

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Treinos</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2.1% em relação ao mês passado
              </p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Torneios Participados</CardTitle>
              <BarChart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{participatedTournaments}</div>
              <p className="text-xs text-muted-foreground">
                +1 em relação ao mês passado
              </p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Rede de Contatos</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{followingCount}</div>
              <p className="text-xs text-muted-foreground">
                +4 novos atletas este mês
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <FollowingAthletes />
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <UpcomingTournaments />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
