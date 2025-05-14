
import AthleteCard from '@/components/athletes/AthleteCard';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { useFollowing } from '@/hooks/useFollowing';

const FollowingAthletes: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { followedAthletes, isLoading, error, unfollowAthlete } = useFollowing(currentUser?.id);
  
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
        {error}
      </div>
    );
  }
  
  if (followedAthletes.length === 0) {
    return (
      <section>
        <h2 className="text-lg font-semibold mb-4">Atletas Seguidos</h2>
        <div className="p-8 text-center text-muted-foreground bg-zinc-900/10 rounded-lg border border-zinc-800">
          <p>Você ainda não segue nenhum atleta.</p>
          <p className="text-sm mt-2">Explore a lista de atletas recentes para começar a seguir.</p>
        </div>
      </section>
    );
  }
  
  const handleAthleteClick = (userId: string) => {
    navigate(`/athletes/${userId}`);
  };

  const handleUnfollowClick = async (userId: string, name: string) => {
    const success = await unfollowAthlete(userId);
    if (success) {
      toast({
        title: "Deixou de seguir",
        description: `Você deixou de seguir ${name}`,
      });
    }
  };

  const handleMessageClick = (userId: string, name: string) => {
    navigate(`/messages/${userId}`);
  };
  
  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Atletas Seguidos</h2>
      <div className="grid grid-cols-1 gap-4">
        {followedAthletes.map((athlete) => {
          // Ensure we have a string for the name and date
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
              onFollowClick={() => handleUnfollowClick(athleteId, athleteName)}
              onMessageClick={() => handleMessageClick(athleteId, athleteName)}
              isFollowed={true}
            />
          );
        })}
      </div>
    </section>
  );
};

export default FollowingAthletes;
