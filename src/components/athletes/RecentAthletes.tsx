
import AthleteCard from '@/components/athletes/AthleteCard';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useGetAthletes } from '@/hooks/useGetAthletes';
import { useAuth } from '@/contexts/auth';
import { useFollowing } from '@/hooks/useFollowing';

const RecentAthletes: React.FC = () => {
  const { athletes, isLoading, error } = useGetAthletes();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { followAthlete, unfollowAthlete, isFollowing } = useFollowing(currentUser?.id);
  
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

  const handleFollowClick = async (userId: string, name: string, isFollowed: boolean) => {
    if (isFollowed) {
      const success = await unfollowAthlete(userId);
      if (success) {
        toast({
          title: "Deixou de seguir",
          description: `Você deixou de seguir ${name}`,
        });
      }
    } else {
      const success = await followAthlete(userId);
      if (success) {
        toast({
          title: "Seguindo atleta",
          description: `Você começou a seguir ${name}`,
        });
      }
    }
  };

  const handleMessageClick = (userId: string, name: string) => {
    navigate(`/messages/${userId}`);
  };
  
  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Atletas Recentes</h2>
      <div className="grid grid-cols-1 gap-4">
        {lastSixAthletes.map((athlete) => {
          // Ensure we have a string for the name and ID
          const athleteId: string = athlete.id || 'unknown-id';
          const athleteName: string = athlete.name || 'Atleta';
          const createdAtString: string = athlete.createdAt ? athlete.createdAt.toLocaleDateString() : 'recentemente';
          
          return (
            <AthleteCard
              key={athleteId}
              athlete={{
                userId: athleteId,
                name: athleteName,
                level: 'beginner',
                bio: `Atleta desde ${createdAtString}`,
                location: {
                  city: 'São Paulo',
                  state: 'SP',
                  country: 'Brasil'
                },
                wins: 0,
                losses: 0
              }}
              onClick={() => handleAthleteClick(athleteId)}
              onFollowClick={() => handleFollowClick(athleteId, athleteName, false)}
              onMessageClick={() => handleMessageClick(athleteId, athleteName)}
            />
          );
        })}
      </div>
    </section>
  );
};

export default RecentAthletes;
