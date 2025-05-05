import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';
import { useTournamentFetch } from '@/hooks/useTournamentFetch';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Calendar, Search, MapPin, Trophy, Users } from 'lucide-react';
import { Tournament } from '@/types';

const TournamentList = () => {
  const { tournaments, loading, error } = useTournamentFetch();
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    if (tournaments) {
      const filtered = tournaments.filter((tournament) => {
        const matchesStatus = tournament.status === activeTab;
        const matchesSearch =
          tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tournament.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tournament.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      });
      setFilteredTournaments(filtered);
    }
  }, [tournaments, activeTab, searchQuery]);

  const sortedTournaments = [...filteredTournaments].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  if (loading) {
    return (
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tournaments</h1>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">{t('common.loading')}</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tournaments</h1>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">{t('common.error')}</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tournaments</h1>
        <p className="text-zinc-400">Descubra e participe de torneios de tênis de mesa</p>
      </div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
          <Input
            type="text"
            placeholder="Search tournaments by name, description or location..."
            className="pl-10 bg-zinc-900 border-zinc-800 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <Tabs defaultValue="upcoming" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-900 border-zinc-800">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        {['upcoming', 'ongoing', 'completed'].map((status) => {
           const tournamentsToShow = sortedTournaments.filter(tournament => tournament.status === status);
          return <TabsContent key={status} value={status}>
          {tournamentsToShow.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournamentsToShow.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          ) : <EmptyState searchQuery={searchQuery} status={status} currentUser={currentUser} />}
          </TabsContent>
        })}
      </Tabs>
    </Layout>
  );
};

const TournamentCard = ({ tournament }: { tournament: Tournament }) => {
  const { currentUser } = useAuth();
  const isRegistered = tournament.registeredParticipants.includes(currentUser?.id || '');
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl truncate">{tournament.name}</CardTitle>
          <Badge className={`
            ${tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' : ''}
            ${tournament.status === 'ongoing' ? 'bg-green-500/20 text-green-400' : ''}
            ${tournament.status === 'completed' ? 'bg-zinc-500/20 text-zinc-400' : ''}
          `}>
            {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{tournament.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-zinc-400">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
            </span>
          </div>
          <div className="flex items-center text-zinc-400">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm truncate">{tournament.location}</span>
          </div>
          <div className="flex items-center text-zinc-400">
            <Users className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {tournament.registeredParticipants.length} / {tournament.maxParticipants} participants
            </span>
          </div>
          <div className="flex items-center text-zinc-400">
            <Trophy className="h-4 w-4 mr-2" />
            <span className="text-sm capitalize">{tournament.format} format</span>
          </div>
        </div>
        
        {tournament.status === 'upcoming' && (
          <Link to={`/tournaments/${tournament.id}`}>
            <Button className="w-full" variant={isRegistered ? "outline" : "default"}>
              {isRegistered ? 'View Details' : 'Register Now'}
            </Button>
          </Link>
        )}
        
        {tournament.status !== 'upcoming' && (
          <Link to={`/tournaments/${tournament.id}`}>
            <Button className="w-full" variant="outline">
              View Details
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

const EmptyState = ({searchQuery, status, currentUser}: { searchQuery: string, status: string, currentUser: any }) => {
  const { t } = useTranslation();
  return (<div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
  <Trophy className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
  <h3 className="text-xl font-medium mb-2">No tournaments found</h3>
  <p className="text-zinc-400 mb-6">
    {searchQuery
      ? "No tournaments match your search criteria"
      : `There are no ${status} tournaments at the moment`}
  </p>
  {currentUser?.role === 'admin' && (
    <Link to="/admin/create-tournament">
      <Button>{t("tournament.create")}</Button>
    </Link>
  )}
</div>)
}
export default TournamentList;
