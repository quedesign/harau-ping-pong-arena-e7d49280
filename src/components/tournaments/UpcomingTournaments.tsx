
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTournament } from '@/contexts/data/TournamentContext';
import { format } from 'date-fns';

const UpcomingTournaments = () => {
  const navigate = useNavigate();
  const { tournaments, loading } = useTournament();

  // Filter to only show upcoming tournaments
  const upcomingTournaments = tournaments
    .filter(tournament => tournament.status === 'upcoming')
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Torneios Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-zinc-900/30 border-zinc-800 animate-pulse">
              <CardContent className="p-0">
                <div className="h-32 bg-zinc-800/50"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 w-3/4 bg-zinc-800/50 rounded"></div>
                  <div className="h-4 w-1/2 bg-zinc-800/50 rounded"></div>
                  <div className="h-10 w-full bg-zinc-800/50 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (upcomingTournaments.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Torneios Disponíveis</h2>
        <Card className="border-dashed border-2 border-zinc-700 bg-transparent">
          <CardContent className="flex flex-col items-center justify-center text-center p-6">
            <Calendar className="h-12 w-12 text-zinc-500 mb-2" />
            <h3 className="text-lg font-medium">Nenhum torneio disponível no momento</h3>
            <p className="text-zinc-400 mt-1">Fique atento para os próximos torneios</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Torneios Disponíveis</h2>
        <Button variant="outline" size="sm" onClick={() => navigate('/tournaments')}>
          Ver todos
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingTournaments.map((tournament) => (
          <Card 
            key={tournament.id} 
            className="bg-zinc-900 border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors"
          >
            <CardContent className="p-0">
              <div className="relative h-32 overflow-hidden bg-zinc-800">
                {tournament.bannerImage ? (
                  <img 
                    src={tournament.bannerImage} 
                    alt={tournament.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                    <span className="text-2xl font-bold text-zinc-500">{tournament.name.charAt(0)}</span>
                  </div>
                )}
                <Badge 
                  className="absolute top-2 right-2" 
                  variant="secondary"
                >
                  {tournament.format}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{tournament.name}</h3>
                <div className="flex items-center text-xs text-zinc-400 mb-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    {format(tournament.startDate, 'dd/MM/yyyy')} - {format(tournament.endDate, 'dd/MM/yyyy')}
                  </span>
                </div>
                <div className="flex items-center text-xs text-zinc-400 mb-3">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate">{tournament.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-zinc-400">
                    <User className="h-3 w-3 mr-1" />
                    <span>
                      {tournament.registeredParticipants?.length || 0}/{tournament.maxParticipants} inscritos
                    </span>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/tournaments/${tournament.id}`)}
                  >
                    Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UpcomingTournaments;
