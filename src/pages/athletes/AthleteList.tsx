import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AthleteProfile } from '@/types';
import { Search, MapPin, Filter, Trophy, UserRound, MessageCircle } from 'lucide-react';
import MessageDialog from "@/components/athlete/MessageDialog";

const AthleteList = () => {
  const { athleteProfiles } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHandedness, setFilterHandedness] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const filteredAthletes = athleteProfiles.filter(profile => {
    const matchesSearch = 
      searchQuery === '' || 
      `Player ${profile.userId}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesHandedness = filterHandedness === 'all' || profile.handedness === filterHandedness;
    const matchesLevel = filterLevel === 'all' || profile.level === filterLevel;
    
    return matchesSearch && matchesHandedness && matchesLevel;
  });

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Athletes</h1>
        <p className="text-zinc-400">
          Connect with table tennis players and schedule matches
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
            <Input
              type="text"
              placeholder="Search by name, location or bio..."
              className="pl-10 bg-zinc-900 border-zinc-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="w-full md:w-40">
              <Select 
                value={filterHandedness} 
                onValueChange={setFilterHandedness}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                  <div className="flex items-center">
                    <Filter size={16} className="mr-2" /> 
                    <span>Hand</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="right">Right-handed</SelectItem>
                  <SelectItem value="left">Left-handed</SelectItem>
                  <SelectItem value="ambidextrous">Ambidextrous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-40">
              <Select 
                value={filterLevel} 
                onValueChange={setFilterLevel}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                  <div className="flex items-center">
                    <Trophy size={16} className="mr-2" /> 
                    <span>Level</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="bg-zinc-900 border-zinc-800">
          <TabsTrigger value="all">All Athletes</TabsTrigger>
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
          <TabsTrigger value="connections">My Connections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {filteredAthletes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAthletes.map((profile) => (
                <AthleteCard key={profile.userId} profile={profile} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
              <UserRound className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
              <h3 className="text-xl font-medium mb-2">No athletes found</h3>
              <p className="text-zinc-400">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="nearby">
          <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
            <MapPin className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-xl font-medium mb-2">Location Access Required</h3>
            <p className="text-zinc-400 mb-4">
              Enable location access to find players near you
            </p>
            <Button>
              Enable Location
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="connections">
          <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
            <UserRound className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-xl font-medium mb-2">No Connections Yet</h3>
            <p className="text-zinc-400 mb-4">
              Connect with other players to see them here
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

const AthleteCard = ({ profile }: { profile: AthleteProfile }) => {
  const playerName = `Player ${profile.userId}`;
  const totalMatches = profile.wins + profile.losses;
  const winPercentage = totalMatches > 0
    ? Math.round((profile.wins / totalMatches) * 100)
    : 0;

  const handleSchedule = () => {
    window.setTimeout(() => {
      import("@/components/ui/sonner").then(({ toast }) =>
        toast.success(`Match request sent to ${playerName}`)
      );
    }, 300);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-zinc-200">
            <span className="text-xl font-semibold">{playerName.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-lg">{playerName}</h3>
            <div className="flex items-center text-sm text-zinc-400 mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              {profile.location.city}, {profile.location.country}
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="text-xs bg-zinc-800 border-zinc-700">
                {profile.handedness}-handed
              </Badge>
              <Badge variant="outline" className="text-xs bg-zinc-800 border-zinc-700 capitalize">
                {profile.level}
              </Badge>
              {profile.yearsPlaying && (
                <Badge variant="outline" className="text-xs bg-zinc-800 border-zinc-700">
                  {profile.yearsPlaying} years
                </Badge>
              )}
            </div>

            {profile.bio && (
              <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{profile.bio}</p>
            )}

            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-3">
                <div className="text-sm">
                  <span className="text-primary font-semibold">{profile.wins}</span>
                  <span className="text-zinc-400"> W</span>
                </div>
                <div className="text-sm">
                  <span className="text-zinc-400 font-semibold">{profile.losses}</span>
                  <span className="text-zinc-400"> L</span>
                </div>
                <div className="text-sm">
                  <span className={`font-semibold ${winPercentage >= 50 ? 'text-green-400' : 'text-zinc-400'}`}>
                    {winPercentage}%
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <MessageDialog
                  athleteName={playerName}
                  onSchedule={handleSchedule}
                  trigger={
                    <Button size="sm" variant="secondary" className="flex gap-1 items-center">
                      <MessageCircle size={16} className="mr-1 text-primary" />
                      Chat
                    </Button>
                  }
                />
                <MessageDialog
                  athleteName={playerName}
                  onSchedule={handleSchedule}
                  trigger={
                    <Button size="sm" variant="outline">
                      Message
                    </Button>
                  }
                />
                <Button size="sm" onClick={handleSchedule}>
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AthleteList;
