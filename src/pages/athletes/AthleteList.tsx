import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AthleteProfile } from '@/types';
import { Search, MapPin, Filter, Trophy, UserRound, MessageCircle, Users, Badge as BadgeIcon, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';

// --- Begin: Add following state ---
const getInitialFollowing = () => {
  // For demo: Try sessionStorage
  const stored = sessionStorage.getItem('followingAthletes');
  return stored ? JSON.parse(stored) : [];
};
// --- End: Add following state ---

const AthleteList = () => {
  const { athleteProfiles } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHandedness, setFilterHandedness] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterPlayingStyle, setFilterPlayingStyle] = useState<string>('all');
  const [filterGripStyle, setFilterGripStyle] = useState<string>('all');
  const [filterPlayFrequency, setFilterPlayFrequency] = useState<string>('all');
  const [filterTournamentParticipation, setFilterTournamentParticipation] = useState<string>('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  
  // --- Begin: Following state ---
  const [following, setFollowing] = useState<string[]>(getInitialFollowing());

  // Sync sessionStorage for persistence between reloads
  const updateFollowing = (newList: string[]) => {
    setFollowing(newList);
    sessionStorage.setItem('followingAthletes', JSON.stringify(newList));
  };

  const handleFollowToggle = (athleteId: string) => {
    if (following.includes(athleteId)) {
      updateFollowing(following.filter(id => id !== athleteId));
    } else {
      updateFollowing([...following, athleteId]);
    }
  };
  // --- End: Following state ---

  const filteredAthletes = athleteProfiles.filter(profile => {
    const matchesSearch = 
      searchQuery === '' || 
      `Player ${profile.userId}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.club?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesHandedness = filterHandedness === 'all' || profile.handedness === filterHandedness;
    const matchesLevel = filterLevel === 'all' || profile.level === filterLevel;
    const matchesPlayingStyle = filterPlayingStyle === 'all' || profile.playingStyle === filterPlayingStyle;
    const matchesGripStyle = filterGripStyle === 'all' || profile.gripStyle === filterGripStyle;
    const matchesPlayFrequency = filterPlayFrequency === 'all' || profile.playFrequency === filterPlayFrequency;
    const matchesTournamentParticipation = filterTournamentParticipation === 'all' || profile.tournamentParticipation === filterTournamentParticipation;
    
    return matchesSearch && 
      matchesHandedness && 
      matchesLevel && 
      matchesPlayingStyle && 
      matchesGripStyle && 
      matchesPlayFrequency && 
      matchesTournamentParticipation;
  });

  // --- Begin: Filter for followed athletes ---
  const followedProfiles = athleteProfiles.filter(profile => following.includes(profile.userId));
  // --- End: Filter for followed athletes ---

  const resetFilters = () => {
    setFilterHandedness('all');
    setFilterLevel('all');
    setFilterPlayingStyle('all');
    setFilterGripStyle('all');
    setFilterPlayFrequency('all');
    setFilterTournamentParticipation('all');
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Encontre Atletas</h1>
        <p className="text-zinc-400">
          Conecte-se com outros jogadores de tênis de mesa e agende partidas
        </p>
      </div>

      {/* --- Followed Athletes Section --- */}
      {followedProfiles.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-2 gap-2">
            <Users className="text-primary" size={20} />
            <h2 className="text-xl font-semibold">Atletas que você segue</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {followedProfiles.map(profile => (
              <div
                key={profile.userId}
                className="flex items-center gap-2 p-2 bg-zinc-900 border border-zinc-800 rounded-lg"
              >
                <span className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-zinc-200 font-bold text-lg">
                  {`Player ${profile.userId}`.charAt(0)}
                </span>
                <span className="font-medium mr-2">{`Player ${profile.userId}`}</span>
                <Link to={`/messages/${profile.userId}`}>
                  <Button size="sm" variant="secondary" className="flex gap-1 items-center">
                    <MessageCircle size={16} className="mr-1 text-primary" />
                    Chat
                  </Button>
                </Link>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleFollowToggle(profile.userId)}
                  aria-label="Unfollow"
                  className="text-zinc-400 hover:text-red-400"
                  title="Unfollow"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
            <Input
              type="text"
              placeholder="Buscar por nome, cidade, clube..."
              className="pl-10 bg-zinc-900 border-zinc-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="w-full md:w-auto flex gap-2 items-center"
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            >
              <Filter size={16} />
              <span>Filtros</span>
              <Badge className="ml-1 bg-primary">{
                (filterHandedness !== 'all' ? 1 : 0) +
                (filterLevel !== 'all' ? 1 : 0) +
                (filterPlayingStyle !== 'all' ? 1 : 0) +
                (filterGripStyle !== 'all' ? 1 : 0) +
                (filterPlayFrequency !== 'all' ? 1 : 0) +
                (filterTournamentParticipation !== 'all' ? 1 : 0)
              }</Badge>
            </Button>
          </div>
        </div>
      </div>

      {isFilterMenuOpen && (
        <div className="mb-6 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center">
              <Filter size={18} className="mr-2" /> Filtros Avançados
            </h3>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Limpar filtros
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm text-zinc-400 mb-1 block">Mão dominante</Label>
              <Select value={filterHandedness} onValueChange={setFilterHandedness}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="right">Destro</SelectItem>
                  <SelectItem value="left">Canhoto</SelectItem>
                  <SelectItem value="ambidextrous">Ambidestro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm text-zinc-400 mb-1 block">Nível</Label>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Todos os níveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os níveis</SelectItem>
                  <SelectItem value="beginner">Iniciante</SelectItem>
                  <SelectItem value="intermediate">Intermediário</SelectItem>
                  <SelectItem value="advanced">Avançado</SelectItem>
                  <SelectItem value="professional">Competidor federado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm text-zinc-400 mb-1 block">Estilo de jogo</Label>
              <Select value={filterPlayingStyle} onValueChange={setFilterPlayingStyle}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Todos os estilos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os estilos</SelectItem>
                  <SelectItem value="offensive">Ofensivo</SelectItem>
                  <SelectItem value="defensive">Defensivo</SelectItem>
                  <SelectItem value="all-around">All-around</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm text-zinc-400 mb-1 block">Tipo de empunhadura</Label>
              <Select value={filterGripStyle} onValueChange={setFilterGripStyle}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Todas as empunhaduras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as empunhaduras</SelectItem>
                  <SelectItem value="classic">Clássica</SelectItem>
                  <SelectItem value="penhold">Caneta</SelectItem>
                  <SelectItem value="other">Outras</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm text-zinc-400 mb-1 block">Frequência de jogo</Label>
              <Select value={filterPlayFrequency} onValueChange={setFilterPlayFrequency}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Todas as frequências" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as frequências</SelectItem>
                  <SelectItem value="once-a-week">1x por semana</SelectItem>
                  <SelectItem value="twice-or-more">2x ou mais por semana</SelectItem>
                  <SelectItem value="weekends-only">Somente fins de semana</SelectItem>
                  <SelectItem value="monthly">Mensalmente</SelectItem>
                  <SelectItem value="rarely">Raramente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm text-zinc-400 mb-1 block">Participação em torneios</Label>
              <Select value={filterTournamentParticipation} onValueChange={setFilterTournamentParticipation}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="yes">Sim</SelectItem>
                  <SelectItem value="no">Não</SelectItem>
                  <SelectItem value="occasionally">Ocasionalmente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="bg-zinc-900 border-zinc-800">
          <TabsTrigger value="all">Todos os Atletas</TabsTrigger>
          <TabsTrigger value="nearby">Próximos</TabsTrigger>
          <TabsTrigger value="connections">Minhas Conexões</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {filteredAthletes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAthletes.map((profile) => (
                <AthleteCard
                  key={profile.userId}
                  profile={profile}
                  isFollowed={following.includes(profile.userId)}
                  handleFollowToggle={handleFollowToggle}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
              <UserRound className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
              <h3 className="text-xl font-medium mb-2">Nenhum atleta encontrado</h3>
              <p className="text-zinc-400">
                Tente ajustar seus filtros ou termos de busca
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="nearby">
          <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
            <MapPin className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-xl font-medium mb-2">Acesso à localização necessário</h3>
            <p className="text-zinc-400 mb-4">
              Ative o acesso à localização para encontrar jogadores próximos a você
            </p>
            <Button>
              Habilitar Localização
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="connections">
          <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
            <UserRound className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-xl font-medium mb-2">Sem conexões ainda</h3>
            <p className="text-zinc-400 mb-4">
              Conecte-se com outros jogadores para vê-los aqui
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

interface AthleteCardProps {
  profile: AthleteProfile;
  isFollowed: boolean;
  handleFollowToggle: (athleteId: string) => void;
}

const AthleteCard = ({ profile, isFollowed, handleFollowToggle }: AthleteCardProps) => {
  const playerName = `Player ${profile.userId}`;
  const totalMatches = profile.wins + profile.losses;
  const winPercentage = totalMatches > 0
    ? Math.round((profile.wins / totalMatches) * 100)
    : 0;

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
                {profile.handedness === 'right' ? 'Destro' : 
                 profile.handedness === 'left' ? 'Canhoto' : 'Ambidestro'}
              </Badge>
              <Badge variant="outline" className="text-xs bg-zinc-800 border-zinc-700">
                {profile.level === 'beginner' ? 'Iniciante' : 
                 profile.level === 'intermediate' ? 'Intermediário' : 
                 profile.level === 'advanced' ? 'Avançado' : 'Competidor federado'}
              </Badge>
              {profile.playingStyle && (
                <Badge variant="outline" className="text-xs bg-zinc-800 border-zinc-700">
                  {profile.playingStyle === 'offensive' ? 'Ofensivo' :
                   profile.playingStyle === 'defensive' ? 'Defensivo' : 'All-around'}
                </Badge>
              )}
              {profile.yearsPlaying && (
                <Badge variant="outline" className="text-xs bg-zinc-800 border-zinc-700">
                  {profile.yearsPlaying} {profile.yearsPlaying === 1 ? 'ano' : 'anos'}
                </Badge>
              )}
            </div>

            <Accordion type="single" collapsible className="mt-2">
              <AccordionItem value="details" className="border-zinc-800">
                <AccordionTrigger className="py-2 text-sm">Mais detalhes</AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-24">
                    <div className="space-y-2 text-sm">
                      {profile.gripStyle && (
                        <div className="flex items-center gap-2">
                          <BadgeIcon size={14} className="text-zinc-400" />
                          <span className="text-zinc-300">Empunhadura: </span>
                          <span>
                            {profile.gripStyle === 'classic' ? 'Clássica' :
                            profile.gripStyle === 'penhold' ? 'Caneta' : 'Outras'}
                          </span>
                        </div>
                      )}
                      
                      {profile.playFrequency && (
                        <div className="flex items-center gap-2">
                          <Timer size={14} className="text-zinc-400" />
                          <span className="text-zinc-300">Frequência: </span>
                          <span>
                            {profile.playFrequency === 'once-a-week' ? '1x por semana' :
                            profile.playFrequency === 'twice-or-more' ? '2x ou mais por semana' :
                            profile.playFrequency === 'weekends-only' ? 'Fins de semana' :
                            profile.playFrequency === 'monthly' ? 'Mensalmente' : 'Raramente'}
                          </span>
                        </div>
                      )}
                      
                      {profile.tournamentParticipation && (
                        <div className="flex items-center gap-2">
                          <Trophy size={14} className="text-zinc-400" />
                          <span className="text-zinc-300">Torneios: </span>
                          <span>
                            {profile.tournamentParticipation === 'yes' ? 'Participa' :
                            profile.tournamentParticipation === 'no' ? 'Não participa' : 'Ocasionalmente'}
                          </span>
                        </div>
                      )}
                      
                      {profile.club && (
                        <div className="flex items-center gap-2">
                          <BadgeCheck size={14} className="text-zinc-400" />
                          <span className="text-zinc-300">Clube: </span>
                          <span>{profile.club}</span>
                        </div>
                      )}
                      
                      {profile.equipment?.racket && (
                        <div className="flex items-center gap-2">
                          <BadgeIcon size={14} className="text-zinc-400" />
                          <span className="text-zinc-300">Raquete: </span>
                          <span>{profile.equipment.racket}</span>
                        </div>
                      )}

                      {profile.availableTimes && profile.availableTimes.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Calendar size={14} className="text-zinc-400 mt-1" />
                          <div>
                            <span className="text-zinc-300">Horários: </span>
                            <span>{profile.availableTimes.join(', ')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-3">
                <div className="text-sm">
                  <span className="text-primary font-semibold">{profile.wins}</span>
                  <span className="text-zinc-400"> V</span>
                </div>
                <div className="text-sm">
                  <span className="text-zinc-400 font-semibold">{profile.losses}</span>
                  <span className="text-zinc-400"> D</span>
                </div>
                <div className="text-sm">
                  <span className={`font-semibold ${winPercentage >= 50 ? 'text-green-400' : 'text-zinc-400'}`}>
                    {winPercentage}%
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/messages/${profile.userId}`}>
                  <Button size="sm" variant="secondary" className="flex gap-1 items-center">
                    <MessageCircle size={16} className="mr-1 text-primary" />
                    Chat
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant={isFollowed ? "ghost" : "default"}
                  onClick={() => handleFollowToggle(profile.userId)}
                  className={isFollowed ? "text-primary border border-primary" : ""}
                >
                  {isFollowed ? "Deixar de seguir" : "Seguir"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Label = ({ children, className, ...props }: React.HTMLAttributes<HTMLLabelElement>) => {
  return (
    <label className={`text-zinc-100 ${className}`} {...props}>
      {children}
    </label>
  );
};

export default AthleteList;
