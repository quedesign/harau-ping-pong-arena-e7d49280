
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Trophy, Users, PlayCircle, PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { tournaments, matches, athleteProfiles } = useData();
  
  if (!currentUser) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Please log in to view your dashboard</h2>
          <Link to="/login">
            <Button className="mt-4">Login</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  // Filter data based on user role and ID
  const userTournaments = currentUser.role === 'admin' 
    ? tournaments.filter(t => t.createdBy === currentUser.id)
    : tournaments.filter(t => t.registeredParticipants.includes(currentUser.id));
  
  const userMatches = matches.filter(m => 
    m.playerOneId === currentUser.id || m.playerTwoId === currentUser.id
  );
  
  const upcomingMatches = userMatches.filter(m => m.status === 'scheduled')
    .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {currentUser.name}</h1>
        <p className="text-zinc-400">
          {currentUser.role === 'admin' 
            ? 'Manage your tournaments and athletes from your admin dashboard.' 
            : 'Track your matches, find tournaments, and connect with other players.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-sm mb-1">
                  {currentUser.role === 'admin' ? 'My Tournaments' : 'Registered Tournaments'}
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
                <p className="text-zinc-400 text-sm mb-1">Upcoming Matches</p>
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
                  {currentUser.role === 'admin' ? 'Athletes' : 'Connections'}
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
                <p className="text-zinc-400 text-sm mb-1">Total Matches</p>
                <p className="text-3xl font-bold">{userMatches.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CalendarDays size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Featured content based on user role */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentUser.role === 'admin' ? (
          <>
            <Card className="bg-zinc-900 border-zinc-800 col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Tournaments</CardTitle>
                <CardDescription>Manage your created tournaments</CardDescription>
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
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-zinc-400 mb-4">You haven't created any tournaments yet</p>
                    <Link to="/admin/create-tournament">
                      <Button>
                        <PlusCircle size={16} className="mr-2" />
                        Create Tournament
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Tournament management tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/admin/create-tournament">
                  <Button className="w-full justify-start" variant="outline">
                    <PlusCircle size={16} className="mr-2" />
                    Create Tournament
                  </Button>
                </Link>
                <Link to="/admin/tournaments">
                  <Button className="w-full justify-start" variant="outline">
                    <Trophy size={16} className="mr-2" />
                    Manage Tournaments
                  </Button>
                </Link>
                <Link to="/admin/athletes">
                  <Button className="w-full justify-start" variant="outline">
                    <Users size={16} className="mr-2" />
                    View Athletes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="bg-zinc-900 border-zinc-800 col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Upcoming Matches</CardTitle>
                <CardDescription>Your scheduled matches</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingMatches.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingMatches.slice(0, 3).map((match) => (
                      <div key={match.id} className="flex justify-between items-center p-3 bg-black rounded-md border border-zinc-800">
                        <div>
                          <h3 className="font-medium">
                            {match.playerOneId === currentUser.id ? 'You' : 'Opponent'} vs. 
                            {match.playerTwoId === currentUser.id ? ' You' : ' Opponent'}
                          </h3>
                          <p className="text-sm text-zinc-400">
                            {match.scheduledTime.toLocaleDateString()} at {match.scheduledTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                        <Link to={`/matches/${match.id}`}>
                          <Button variant="outline" size="sm" className="border-zinc-700">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-zinc-400 mb-4">You don't have any upcoming matches</p>
                    <Link to="/athletes">
                      <Button>
                        <Users size={16} className="mr-2" />
                        Find Players
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Available Tournaments</CardTitle>
                <CardDescription>Tournaments you can join</CardDescription>
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
                        View All Tournaments
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-zinc-400">No upcoming tournaments</p>
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
