import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, MapPin, Calendar, Award, Clock, Trophy, 
  Mail, MessageSquare, BarChart 
} from 'lucide-react';

const AthleteProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { athleteProfiles, matches } = useData();
  const { currentUser } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    // Find athlete profile
    const profile = athleteProfiles.find(p => p.userId === id);
    
    // Get athlete matches
    const athleteMatches = matches.filter(m => 
      m.playerOneId === id || m.playerTwoId === id
    );

    if (!profile) {
      navigate('/athletes');
    }
  }, [id, athleteProfiles, matches, navigate]);

  // In a real app, you would fetch the user data
  const athleteName = `Player ${profile.userId}`;
  const isOwnProfile = currentUser?.id === id;

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{athleteName}</h1>
          <p className="text-zinc-400">{profile.bio || 'Table tennis athlete'}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            Back
          </Button>
          
          {!isOwnProfile && (
            <>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button 
                size="sm"
                disabled={isConnecting}
                onClick={() => setIsConnecting(true)}
              >
                Connect
              </Button>
            </>
          )}
          
          {isOwnProfile && (
            <Button 
              size="sm"
              onClick={() => navigate('/profile/edit')}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-zinc-900 border-zinc-800 h-fit">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center text-white mb-4">
                <span className="text-3xl font-semibold">{athleteName.charAt(0)}</span>
              </div>
              
              <h2 className="text-xl font-bold mb-1">{athleteName}</h2>
              <p className="text-zinc-400 text-sm flex items-center mb-4">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {profile.location.city}, {profile.location.country}
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <Badge variant="outline" className="bg-zinc-800 border-zinc-700 capitalize">
                  {profile.level}
                </Badge>
                <Badge variant="outline" className="bg-zinc-800 border-zinc-700">
                  {profile.handedness}-handed
                </Badge>
                {profile.yearsPlaying && (
                  <Badge variant="outline" className="bg-zinc-800 border-zinc-700">
                    {profile.yearsPlaying} years experience
                  </Badge>
                )}
              </div>

              <div className="w-full grid grid-cols-3 gap-2 text-center mb-6">
                <div className="bg-black p-3 rounded-md">
                  <p className="text-primary text-xl font-bold">{profile.wins}</p>
                  <p className="text-xs text-zinc-400">Wins</p>
                </div>
                <div className="bg-black p-3 rounded-md">
                  <p className="text-zinc-400 text-xl font-bold">{profile.losses}</p>
                  <p className="text-xs text-zinc-400">Losses</p>
                </div>
                <div className="bg-black p-3 rounded-md">
                  <p className="text-lg font-bold">
                    {profile.wins + profile.losses > 0 
                      ? Math.round((profile.wins / (profile.wins + profile.losses)) * 100) 
                      : 0}
                    <span className="text-xs">%</span>
                  </p>
                  <p className="text-xs text-zinc-400">Win Rate</p>
                </div>
              </div>
              
              <Separator className="mb-6" />
              
              <div className="w-full space-y-4">
                {profile.height && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Height:</span>
                    <span>{profile.height} cm</span>
                  </div>
                )}
                
                {profile.weight && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Weight:</span>
                    <span>{profile.weight} kg</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Playing style:</span>
                  <span>Offensive</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Member since:</span>
                  <span>Jan 2024</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="stats" className="mb-8">
            <TabsList className="bg-zinc-900 border-zinc-800">
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="matches">Match History</TabsTrigger>
              <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stats">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2" />
                    Performance Statistics
                  </CardTitle>
                  <CardDescription>
                    Detailed stats for this athlete
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Total Matches:</span>
                        <span className="font-medium">{profile.wins + profile.losses}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Tournaments Joined:</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Highest Streak:</span>
                        <span className="font-medium">4 wins</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Win Rate:</span>
                        <span className="font-medium">
                          {profile.wins + profile.losses > 0 
                            ? Math.round((profile.wins / (profile.wins + profile.losses)) * 100) 
                            : 0}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Avg. Points per Game:</span>
                        <span className="font-medium">9.3</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Best Tournament:</span>
                        <span className="font-medium">Semi-finalist</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center py-8">
                    <p className="text-zinc-400">
                      Detailed performance charts will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="matches">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Match History
                  </CardTitle>
                  <CardDescription>
                    Recent matches and outcomes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {athleteMatches.length > 0 ? (
                    <div className="space-y-4">
                      {athleteMatches.map((match) => (
                        <div key={match.id} className="flex justify-between items-center p-3 bg-black rounded-md border border-zinc-800">
                          <div>
                            <p className="font-medium">
                              {match.playerOneId === id ? 'You' : 'Opponent'} vs. 
                              {match.playerTwoId === id ? ' You' : ' Opponent'}
                            </p>
                            <p className="text-sm text-zinc-400">
                              {match.scheduledTime.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-sm">
                            {match.status === 'completed' ? (
                              <Badge className={`
                                ${match.winner === id ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                              `}>
                                {match.winner === id ? 'Win' : 'Loss'}
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-500/20 text-blue-400">
                                {match.status === 'scheduled' ? 'Upcoming' : 'Cancelled'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-zinc-400">
                        No match history available
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tournaments">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Tournament Participation
                  </CardTitle>
                  <CardDescription>
                    Tournaments and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-zinc-400">
                      Tournament history will appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Schedule a Match
              </CardTitle>
              <CardDescription>
                {isOwnProfile 
                  ? 'View and manage match requests' 
                  : 'Send a match request to this player'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isOwnProfile ? (
                <div className="text-center py-8">
                  <p className="text-zinc-400 mb-4">
                    You have no pending match requests
                  </p>
                  <Button>View Match History</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-zinc-400">
                    You can schedule a friendly match with this player.
                  </p>
                  <Button className="w-full">
                    Request a Match
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AthleteProfile;
