
import AthleteCard from '@/components/athletes/AthleteCard';
import { Loader2 } from 'lucide-react';
import { useGetAthletes } from '@/hooks/useGetAthletes';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const RecentAthletes: React.FC = () => {
  const { athletes, isLoading, error } = useGetAthletes();
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">
        Erro ao carregar atletas: {error}
      </div>
    );
  }
  
  const lastSixAthletes = athletes ? athletes.slice(-6).reverse() : [];
  
  const handleAthleteClick = (userId: string) => {
    navigate(`/athletes/${userId}`);
  };

  const handleFollowClick = (userId: string, name: string) => {
    // This would integrate with the follow functionality in a real app
    toast({
      title: "Seguindo atleta",
      description: `Você começou a seguir ${name}`,
    });
  };

  const handleMessageClick = (userId: string, name: string) => {
    // This would integrate with the messaging functionality in a real app
    toast({
      title: "Nova mensagem",
      description: `Iniciando conversa com ${name}`,
    });
  };
  
  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Atletas Recentes</h2>
      <div className="grid grid-cols-1 gap-4">
        {lastSixAthletes.map((athlete) => {
          // Ensure we have a string for the name
          const athleteName = athlete.name ?? 'Atleta';
          
          return (
            <AthleteCard
              key={athlete.id}
              athlete={{
                userId: athlete.id,
                name: athleteName,
                level: 'beginner' as 'beginner',
                bio: `Atleta desde ${athlete.createdAt?.toLocaleDateString() ?? 'recentemente'}`,
                location: {
                  city: 'São Paulo',
                  state: 'SP',
                  country: 'Brasil'
                },
                wins: 0,
                losses: 0
              }}
              onClick={() => handleAthleteClick(athlete.id)}
              onFollowClick={() => handleFollowClick(athlete.id, athleteName)}
              onMessageClick={() => handleMessageClick(athlete.id, athleteName)}
            />
          );
        })}
      </div>
    </section>
  );
};

export default RecentAthletes;
