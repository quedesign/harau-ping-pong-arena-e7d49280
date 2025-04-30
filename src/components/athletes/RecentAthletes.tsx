import { Athlete } from '@/types';

interface RecentAthletesProps {
  athletes: Athlete[];
}

const RecentAthletes: React.FC<RecentAthletesProps> = ({ athletes }) => {
  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-4">Atletas Recentes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {athletes.map((athlete) => (
          <div
            key={athlete.userId}
            className="bg-zinc-900 p-4 rounded-lg border border-zinc-800"
          >
            <h3 className="font-semibold">{`Player ${athlete.userId}`}</h3>
            <p className="text-zinc-400 text-sm">{athlete.level}</p>
            <p className="text-zinc-400 text-sm">
              {athlete.location.city}, {athlete.location.country}
            </p>
            <p className="text-zinc-400 text-sm">{athlete.playingStyle}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentAthletes;