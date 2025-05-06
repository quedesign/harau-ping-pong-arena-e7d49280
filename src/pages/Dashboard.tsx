
import { useAuth } from '@/contexts/auth';
import { useData } from '@/contexts/DataContext';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, X } from 'lucide-react';
import * as React from 'react';
import { CalendarDays, Trophy, PlayCircle, PlusCircle } from 'lucide-react';

const getInitialFollowing = () => {
  const stored = sessionStorage.getItem('followingAthletes');
  return stored ? JSON.parse(stored) : [];
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { tournaments, matches, athleteProfiles } = useData();

  const [following, setFollowing] = React.useState<string[]>(getInitialFollowing());

  React.useEffect(() => {
    const handler = () => setFollowing(getInitialFollowing());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const updateFollowing = (newList: string[]) => {
    setFollowing(newList);
    sessionStorage.setItem('followingAthletes', JSON.stringify(newList));
  };
  const handleUnfollow = (athleteId: string) => {
    updateFollowing(following.filter((id) => id !== athleteId));
  };

  const followedProfiles = athleteProfiles.filter(profile => following.includes(profile.userId));

  if (!currentUser) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Por favor, faça login para visualizar seu painel</h2>
          <Link to="/login">
              <Button className="mt-4">Entrar</Button>
            </Link>
        </div>
      </Layout>
    );
  }

  const userId = currentUser.id || '';
  
  const userTournaments = currentUser.role === 'admin' 
    ? tournaments.filter(t => t.createdBy === userId)
    : tournaments.filter(t => t.registeredParticipants.includes(userId));
  
  const userMatches = matches.filter(m => 
    m.playerOneId === userId || m.playerTwoId === userId
  );
  
  const upcomingMatches = userMatches.filter(m => m.status === 'scheduled')
    .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo(a), {currentUser.name}</h1>
        <p className="text-zinc-400">
          {currentUser.role === 'admin'
            ? 'Gerencie seus torneios e atletas pelo seu painel de administrador.'
            : 'Acompanhe suas partidas, encontre torneios e conecte-se com outros jogadores.'}
          </p>
      </div>

      <div className="mb-10">
        <div className="flex items-center mb-3 gap-2">
          <Users className="text-primary" size={22} />
          <h2 className="text-xl font-semibold">Atletas que Você Segue</h2>
        </div>
        {followedProfiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {followedProfiles.map(profile => (
              <Card key={profile.userId} className="flex flex-col bg-zinc-900 border-zinc-800">
                <CardContent className="p-5 flex flex-row gap-4 items-center">
                  <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-zinc-200 text-xl font-bold overflow-hidden">
                    <span>{`Player ${profile.userId}`.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{`Player ${profile.userId}`}</div>
                    <div className="text-xs text-zinc-400">{profile.location.city}, {profile.location.country}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link to={`/messages/${profile.userId}`}>
                      <Button size="sm" variant="secondary" className="flex gap-1 items-center">
                        <MessageCircle size={16} className="mr-1 text-primary" />
                        Conversar
                      </Button>
                    </Link>
                    <Button
                      size="icon"
                      variant="ghost"
                        onClick={() => handleUnfollow(profile.userId)}
                      aria-label="Unfollow"
                      className="text-zinc-400 hover:text-red-500 border border-transparent hover:border-red-400"
                      title="Unfollow"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-zinc-900 rounded-lg border border-zinc-800">
            <Users className="mx-auto h-8 w-8 text-zinc-600 mb-2" />
            <p className="text-zinc-400">Você ainda não está seguindo nenhum atleta. Vá para a página "Encontrar Atletas" para seguir e conectar-se.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-sm mb-1">
                  {currentUser.role === 'admin' ? 'Meus Torneios' : 'Torneios Inscritos'}
                </p>
                <p className="text-3xl font-bold">{userTournaments.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Trophy size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>                
                <p className="text-zinc-400 text-sm mb-1">Próximas Partidas</p>
                <p className="text-3xl font-bold">{upcomingMatches.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <PlayCircle size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-sm mb-1">
                  {currentUser.role === 'admin' ? 'Atletas' : 'Conexões'}
                </p>
                <p className="text-3xl font-bold">{athleteProfiles.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Users size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-sm mb-1">Total de Partidas</p>
                <p className="text-3xl font-bold">{userMatches.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CalendarDays size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentUser.role === 'admin' ? (
          <>
            <Card className="bg-zinc-900 border-zinc-800 col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Torneios Recentes</CardTitle>
                <CardDescription>Gerencie seus torneios criados</CardDescription>
              </CardHeader>
              <CardContent>
                {userTournaments.length > 0 ? (
                  <div className="space-y-4">
                    {userTournaments.slice(0, 3).map((tournament) => (
                      <div key={tournament.id} className="flex justify-between items-center p-3 bg-black rounded-md border border-zinc-800">
                        <div>
                          <h3 className="font-medium">{tournament.name}</h3>
                          <p className="text-sm text-zinc-400">
                            {new Date(tournament.startDate).toLocaleDateString()} - {tournament.registeredParticipants.length} participants
                          </p>
                        </div>
                        <Link to={`/admin/tournaments/${tournament.id}`}>
                          <Button variant="outline" size="sm" className="border-zinc-700">
                            Ver
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-zinc-400 mb-4">Você ainda não criou nenhum torneio</p>
                    <Link to="/admin/create-tournament">
                      <Button>
                        <PlusCircle size={16} className="mr-2" />
                        Criar Torneio
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Ferramentas de gerenciamento de torneios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/admin/create-tournament">
                  <Button className="w-full justify-start" variant="outline">
                    <PlusCircle size={16} className="mr-2" />
                    Criar Torneio
                  </Button>
                </Link>
                <Link to="/admin/tournaments">
                  <Button className="w-full justify-start" variant="outline">
                    <Trophy size={16} className="mr-2" />
                    Gerenciar Torneios
                  </Button>
                </Link>
                <Link to="/admin/athletes">
                  <Button className="w-full justify-start" variant="outline">
                    <Users size={16} className="mr-2" />
                    Ver Atletas
                  </Button>
                </Link>
              </CardContent>
            </Card>          
          </>
        ) : (
          <>
            <Card className="bg-zinc-900 border-zinc-800 col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Próximas Partidas</CardTitle>
                <CardDescription>Suas Partidas Agendadas</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingMatches.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingMatches.slice(0, 3).map((match) => (
                      <div key={match.id} className="flex justify-between items-center p-3 bg-black rounded-md border border-zinc-800">
                        <div>
                          <h3 className="font-medium">
                            {match.playerOneId === currentUser.id ? 'Você' : 'Oponente'} vs.
                            {match.playerTwoId === currentUser.id ? ' Você' : ' Oponente'}
                          </h3>
                          <p className="text-sm text-zinc-400">
                            {match.scheduledTime.toLocaleDateString()} at {match.scheduledTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                        <Link to={`/matches/${match.id}`}>
                            <Button variant="outline" size="sm" className="border-zinc-700">
                                Ver
                              </Button>
                            </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-zinc-400 mb-4">Você não tem nenhuma partida agendada</p>
                    <Link to="/athletes">
                      <Button>
                        <Users size={16} className="mr-2" />
                        Encontrar Jogadores
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Torneios Disponíveis</CardTitle>
                <CardDescription>Torneios que você pode participar</CardDescription>
              </CardHeader>
              <CardContent>
                {tournaments.filter(t => t.status === 'upcoming').length > 0 ? (
                  <div className="space-y-3">
                    {tournaments
                      .filter(t => t.status === 'upcoming')
                      .slice(0, 3)
                      .map((tournament) => (
                        <Link key={tournament.id} to={`/tournaments/${tournament.id}`}>
                          <div className="p-3 bg-black rounded-md border border-zinc-800 hover:border-primary transition-colors">
                            <h3 className="font-medium">{tournament.name}</h3>
                            <p className="text-sm text-zinc-400">
                              {new Date(tournament.startDate).toLocaleDateString()}
                            </p>
                          </div>
                        </Link>
                      ))}
                    <Link to="/tournaments">
                      <Button variant="link" className="w-full mt-2">
                        Ver Todos os Torneios
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-6">                   
                    <p className="text-zinc-400">Nenhum torneio futuro</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
