
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Trophy, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MOCK_TOURNAMENTS = [
  {
    id: "t1",
    title: "Campeonato Municipal",
    date: "25/05/2025",
    location: "São Paulo, SP",
    participants: 24
  },
  {
    id: "t2",
    title: "Copa Regional",
    date: "12/06/2025",
    location: "Campinas, SP",
    participants: 32
  }
];

const UpcomingTournaments = () => {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Torneios Disponíveis</h2>
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Trophy className="h-4 w-4 text-primary mr-2" />
            Próximos Torneios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {MOCK_TOURNAMENTS.map(tournament => (
            <div key={tournament.id} className="border border-zinc-800 rounded-md p-3">
              <h3 className="font-medium text-sm">{tournament.title}</h3>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-xs text-zinc-400">
                  <Calendar className="h-3 w-3 mr-1 text-primary" />
                  <span>{tournament.date}</span>
                </div>
                <div className="flex items-center text-xs text-zinc-400">
                  <MapPin className="h-3 w-3 mr-1 text-primary" />
                  <span>{tournament.location}</span>
                </div>
                <div className="flex items-center text-xs text-zinc-400">
                  <Users className="h-3 w-3 mr-1 text-primary" />
                  <span>{tournament.participants} participantes</span>
                </div>
              </div>
              <div className="mt-3">
                <Link to={`/tournaments/${tournament.id}`}>
                  <Button size="sm" variant="outline" className="w-full">
                    Ver Detalhes
                  </Button>
                </Link>
              </div>
            </div>
          ))}
          
          <Link to="/tournaments" className="block">
            <Button variant="default" className="w-full mt-2">
              Ver Todos os Torneios
            </Button>
          </Link>
        </CardContent>
      </Card>
    </section>
  );
};

export default UpcomingTournaments;
