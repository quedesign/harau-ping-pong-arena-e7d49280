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
  Mail, MessageCircle, BarChart, Badge as BadgeIcon, BadgeCheck, Timer, 
  CircleUser, Swords, Users
} from 'lucide-react';
import { AthleteProfile as AthleteProfileType, Match } from '@/types';

const AthleteProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { athleteProfiles, matches } = useData();
  const { currentUser } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [profile, setProfile] = useState<AthleteProfileType | null>(null);
  const [athleteMatches, setAthleteMatches] = useState<Match[]>([]);

  const { t } = useTranslation();

  useEffect(() => {
    if (id && athleteProfiles.length > 0) {
      // Find athlete profile
      const foundProfile = athleteProfiles.find(p => p.userId === id);
      
      if (foundProfile) {
        setProfile(foundProfile);
        
        // Get athlete matches
        const foundMatches = matches.filter(m => 
          m.playerOneId === id || m.playerTwoId === id
        );
        
        setAthleteMatches(foundMatches);
      } else {
        navigate('/athletes');
      }
    }
  }, [id, athleteProfiles, matches, navigate]);

  if (!profile) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // In a real app, you would fetch the user data
  const athleteName = `Player ${profile.userId}`;
  const isOwnProfile = currentUser?.id === id;

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{athleteName}</h1>
          <p className="text-zinc-400">{profile.bio || 'Atleta de tênis de mesa'}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            Voltar
          </Button>
          
          {!isOwnProfile && (
            <>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Mensagem
              </Button>
              <Button 
                size="sm"
                disabled={isConnecting}
                onClick={() => setIsConnecting(true)}
              >
                Conectar
              </Button>
            </>
          )}
          
          {isOwnProfile && (
            <Button 
              size="sm"
              onClick={() => navigate('/profile')}
            >
              Editar Perfil
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
                <Badge variant="outline" className="bg-zinc-800 border-zinc-700">
                  {profile.level === 'beginner' ? 'Iniciante' : 
                   profile.level === 'intermediate' ? 'Intermediário' : 
                   profile.level === 'advanced' ? 'Avançado' : 'Competidor federado'}
                </Badge>
                <Badge variant="outline" className="bg-zinc-800 border-zinc-700">
                  {profile.handedness === 'right' ? 'Destro' : 
                   profile.handedness === 'left' ? 'Canhoto' : 'Ambidestro'}
                </Badge>
                {profile.yearsPlaying && (
                  <Badge variant="outline" className="bg-zinc-800 border-zinc-700">
                    {profile.yearsPlaying} {profile.yearsPlaying === 1 ? 'ano' : 'anos'} de experiência
                  </Badge>
                )}
              </div>

              <div className="w-full grid grid-cols-3 gap-2 text-center mb-6">
                <div className="bg-black p-3 rounded-md">
                  <p className="text-primary text-xl font-bold">{profile.wins}</p>
                  <p className="text-xs text-zinc-400">Vitórias</p>
                </div>
                <div className="bg-black p-3 rounded-md">
                  <p className="text-zinc-400 text-xl font-bold">{profile.losses}</p>
                  <p className="text-xs text-zinc-400">Derrotas</p>
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
                {profile.playingStyle && (
                  <div className="flex items-center gap-2">
                    <Swords size={16} className="text-zinc-400" />
                    <span className="text-zinc-400">Estilo de jogo:</span>
                    <span className="ml-auto">
                      {profile.playingStyle === 'offensive' ? 'Ofensivo' :
                       profile.playingStyle === 'defensive' ? 'Defensivo' : 'All-around'}
                    </span>
                  </div>
                )}
                
                {profile.gripStyle && (
                  <div className="flex items-center gap-2">
                    <Grip size={16} className="text-zinc-400" />
                    <span className="text-zinc-400">Empunhadura:</span>
                    <span className="ml-auto">
                      {profile.gripStyle === 'classic' ? 'Clássica' :
                       profile.gripStyle === 'penhold' ? 'Caneta' : 'Outras'}
                    </span>
                  </div>
                )}
                
                {profile.playFrequency && (
                  <div className="flex items-center gap-2">
                    <Timer size={16} className="text-zinc-400" />
                    <span className="text-zinc-400">Frequência:</span>
                    <span className="ml-auto">
                      {profile.playFrequency === 'once-a-week' ? '1x por semana' :
                       profile.playFrequency === 'twice-or-more' ? '2x ou mais' :
                       profile.playFrequency === 'weekends-only' ? 'Fins de semana' :
                       profile.playFrequency === 'monthly' ? 'Mensalmente' : 'Raramente'}
                    </span>
                  </div>
                )}
                
                {profile.tournamentParticipation && (
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-zinc-400" />
                    <span className="text-zinc-400">Torneios:</span>
                    <span className="ml-auto">
                      {profile.tournamentParticipation === 'yes' ? 'Participa' :
                       profile.tournamentParticipation === 'no' ? 'Não participa' : 'Ocasionalmente'}
                    </span>
                  </div>
                )}

                {profile.club && (
                  <div className="flex items-center gap-2">
                    <BadgeCheck size={16} className="text-zinc-400" />
                    <span className="text-zinc-400">Clube:</span>
                    <span className="ml-auto">{profile.club}</span>
                  </div>
                )}
                
                {profile.height && (
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-zinc-400" />
                    <span className="text-zinc-400">Altura:</span>
                    <span className="ml-auto">{profile.height} cm</span>
                  </div>
                )}
                
                {profile.weight && (
                  <div className="flex items-center gap-2">
                    <CircleUser size={16} className="text-zinc-400" />
                    <span className="text-zinc-400">Peso:</span>
                    <span className="ml-auto">{profile.weight} kg</span>
                  </div>
                )}
              </div>

              {/* Equipment section */}
              {(profile.equipment?.racket || profile.equipment?.rubbers) && (
                <>
                  <Separator className="my-6" />
                  
                  <div className="w-full">
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <BadgeIcon size={16} />
                      Equipamentos
                    </h3>
                    
                    <div className="space-y-3">
                      {profile.equipment.racket && (
                        <div className="bg-zinc-800 p-3 rounded-md text-sm">
                          <p className="text-zinc-400 mb-1">Raquete:</p>
                          <p>{profile.equipment.racket}</p>
                        </div>
                      )}
                      
                      {profile.equipment.rubbers && (
                        <div className="bg-zinc-800 p-3 rounded-md text-sm">
                          <p className="text-zinc-400 mb-1">Borrachas:</p>
                          <p>{profile.equipment.rubbers}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Available times */}
              {profile.availableTimes && profile.availableTimes.length > 0 && (
                <>
                  <Separator className="my-6" />
                  
                  <div className="w-full">
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Calendar size={16} />
                      Horários disponíveis
                    </h3>
                    
                    <div className="bg-zinc-800 p-3 rounded-md text-sm">
                      <ul className="list-disc list-inside space-y-1">
                        {profile.availableTimes.map((time, index) => (
                          <li key={index} className="text-zinc-300">{time}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {/* Preferred locations */}
              {profile.preferredLocations && profile.preferredLocations.length > 0 && (
                <>
                  <Separator className="my-6" />
                  
                  <div className="w-full">
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <MapPin size={16} />
                      Locais preferidos
                    </h3>
                    
                    <div className="bg-zinc-800 p-3 rounded-md text-sm">
                      <ul className="list-disc list-inside space-y-1">
                        {profile.preferredLocations.map((loc, index) => (
                          <li key={index} className="text-zinc-300">{loc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="stats" className="mb-8">
            <TabsList className="bg-zinc-900 border-zinc-800">
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              <TabsTrigger value="matches">Histórico de Partidas</TabsTrigger>
              <TabsTrigger value="tournaments">Torneios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stats">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2" />
                    Estatísticas de Desempenho
                  </CardTitle>
                  <CardDescription>
                    Estatísticas detalhadas deste atleta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Total de Partidas:</span>
                        <span className="font-medium">{profile.wins + profile.losses}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Torneios Participados:</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Maior Sequência:</span>
                        <span className="font-medium">4 vitórias</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Taxa de Vitória:</span>
                        <span className="font-medium">
                          {profile.wins + profile.losses > 0 
                            ? Math.round((profile.wins / (profile.wins + profile.losses)) * 100) 
                            : 0}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Média de Pontos por Jogo:</span>
                        <span className="font-medium">9.3</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Melhor Torneio:</span>
                        <span className="font-medium">Semi-finalista</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center py-8">
                    <p className="text-zinc-400">
                      Gráficos detalhados de desempenho aparecerão aqui
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
                    Histórico de Partidas
                  </CardTitle>
                  <CardDescription>
                    Partidas recentes e resultados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {athleteMatches.length > 0 ? (
                    <div className="space-y-4">
                      {athleteMatches.map((match) => (
                        <div key={match.id} className="flex justify-between items-center p-3 bg-black rounded-md border border-zinc-800">
                          <div>
                            <p className="font-medium">
                              {match.playerOneId === id ? 'Você' : 'Oponente'} vs. 
                              {match.playerTwoId === id ? ' Você' : ' Oponente'}
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
                                {match.winner === id ? 'Vitória' : 'Derrota'}
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-500/20 text-blue-400">
                                {match.status === 'scheduled' ? 'Agendada' : 'Cancelada'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-zinc-400">
                        Nenhum histórico de partidas disponível
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
                    Participação em Torneios
                  </CardTitle>
                  <CardDescription>
                    Torneios e conquistas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-zinc-400">
                      O histórico de torneios aparecerá aqui
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Agendar uma Partida
              </CardTitle>
              <CardDescription>
                {isOwnProfile 
                  ? 'Visualize e gerencie solicitações de partidas' 
                  : 'Envie uma solicitação de partida para este jogador'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isOwnProfile ? (
                <div className="text-center py-8">
                  <p className="text-zinc-400 mb-4">
                    Você não tem solicitações de partidas pendentes
                  </p>
                  <Button>Ver Histórico de Partidas</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-zinc-400">
                    Você pode agendar uma partida amistosa com este jogador.
                  </p>
                  <Button className="w-full">
                    Solicitar uma Partida
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
