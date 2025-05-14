
import AthleteCard from '@/components/athletes/AthleteCard';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { User } from '@/types';

const FollowingAthletes: React.FC = () => {
  const [followedAthletes, setFollowedAthletes] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // In a real app, we would fetch the followed athletes from the database
  // For now, we'll simulate this with a placeholder implementation
  useEffect(() => {
    const fetchFollowedAthletes = async () => {
      setIsLoading(true);
      try {
        // Placeholder for API call to get followed athletes
        // In a real application, this would fetch from the database
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Placeholder data
        const mockFollowedAthletes: User[] = [
          {
            id: 'followed-1',
            name: 'Carlos Silva',
            email: 'carlos@example.com',
            role: 'athlete',
            createdAt: new Date('2023-01-15')
          },
          {
            id: 'followed-2',
            name: 'Ana Soares',
            email: 'ana@example.com',
            role: 'athlete',
            createdAt: new Date('2023-03-22')
          }
        ];
        
        setFollowedAthletes(mockFollowedAthletes);
      } catch (err) {
        console.error('Error fetching followed athletes:', err);
        setError('Erro ao carregar atletas seguidos');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFollowedAthletes();
  }, [currentUser]);
  
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
        <div className="p-8 text-center text-muted-foreground bg-accent/10 rounded-lg">
          <p>Você ainda não segue nenhum atleta.</p>
          <p className="text-sm mt-2">Explore a lista de atletas recentes para começar a seguir.</p>
        </div>
      </section>
    );
  }
  
  const handleAthleteClick = (userId: string) => {
    navigate(`/athletes/${userId}`);
  };

  const handleUnfollowClick = (userId: string, name: string) => {
    // Remove athlete from followed list
    setFollowedAthletes(prev => prev.filter(athlete => athlete.id !== userId));
    
    toast({
      title: "Deixou de seguir",
      description: `Você deixou de seguir ${name}`,
    });
  };

  const handleMessageClick = (userId: string, name: string) => {
    toast({
      title: "Nova mensagem",
      description: `Iniciando conversa com ${name}`,
    });
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
            />
          );
        })}
      </div>
    </section>
  );
};

export default FollowingAthletes;
