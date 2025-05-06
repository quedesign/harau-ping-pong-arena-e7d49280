
import AthleteCard from '@/components/athletes/AthleteCard';
import { Loader2 } from 'lucide-react';
import { useGetAthletes } from '@/hooks/useGetAthletes';

const RecentAthletes: React.FC = () => {
  const { athletes, isLoading, error } = useGetAthletes();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  
  if(error){
    return (
      <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">
        Erro ao carregar atletas: {error}
      </div>
    );
  }
  
  const lastSixAthletes = athletes ? athletes.slice(-6).reverse() : [];
  
  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Atletas Recentes</h2>
      <div className="grid grid-cols-1 gap-4">
        {lastSixAthletes.map((athlete) => (
          <AthleteCard
            key={athlete.id}
            athlete={{
              userId: athlete.id,
              name: athlete.name || 'Atleta', // Corrigido: garantindo que nunca seja undefined
              level: 'beginner',
              bio: `Atleta desde ${athlete.createdAt?.toLocaleDateString() ?? 'recentemente'}`,
              location: {
                city: 'São Paulo',
                state: 'SP',
                country: 'Brasil'
              },
              wins: 0,
              losses: 0
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default RecentAthletes;
