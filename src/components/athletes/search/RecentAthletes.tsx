
import { AthleteProfile } from "@/types";
import AthleteCard from "@/components/athletes/AthleteCard";

interface RecentAthletesProps {
  athletes: AthleteProfile[];
  loading?: boolean;
}

const RecentAthletes: React.FC<RecentAthletesProps> = ({ athletes, loading = false }) => {
  if (loading) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Atletas Recentes</h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Atletas Recentes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {athletes.map((athlete) => (
          <AthleteCard 
            key={athlete.userId} 
            athlete={{
              ...athlete,
              name: athlete.name || 'Atleta', // Ensuring name is always a string
            }} 
          />
        ))}
      </div>
    </section>
  );
};

export default RecentAthletes;
