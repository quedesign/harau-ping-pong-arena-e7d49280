
import { Athlete, AthleteProfile } from '@/types';
import { useGetAthletes } from '@/hooks/useGetAthletes';
import { Loader2 } from 'lucide-react';

const RecentAthletes: React.FC = () => {
  const { athletes, isLoading, error } = useGetAthletes();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      </div>
    );
  }
  
  if(error){
    return <div>Error: {error}</div>
  }
  
  const lastSixAthletes = athletes ? athletes.slice(-6).reverse() : [];
  
  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Atletas Recentes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lastSixAthletes.map((athlete) => (
          <div
            key={athlete.userId || athlete.id}
            className="bg-zinc-900 p-4 rounded-lg border border-zinc-800"
          >
            <h3 className="font-semibold">{athlete.name || `Atleta ${athlete.userId || athlete.id}`}</h3>
            {athlete.level && <p className="text-zinc-400 text-sm">{athlete.level}</p>}
            {athlete.location && (
              <p className="text-zinc-400 text-sm">
                {athlete.location.city}, {athlete.location.country}
              </p>
            )}
            {athlete.playingStyle && <p className="text-zinc-400 text-sm">{athlete.playingStyle}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentAthletes;
