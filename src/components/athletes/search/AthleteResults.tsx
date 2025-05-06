
import { AthleteProfile } from '@/types';
import { useAthlete } from '@/contexts/data/athlete';
import { AthleteCard, EmptyState } from '@/components';

interface AthleteResultsProps {
  filteredAthletes: AthleteProfile[];
  noResults: boolean;
  searchTerm: string;
  filtersApplied: boolean;
  setActiveTab: (tab: string) => void;
}

const AthleteResults = ({
  filteredAthletes,
  noResults,
  searchTerm,
  filtersApplied,
  setActiveTab,
}: AthleteResultsProps) => {
  const { isLoading } = useAthlete();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (noResults) {
    let message = "Nenhum atleta encontrado.";
    
    if (searchTerm && filtersApplied) {
      message = `Nenhum atleta encontrado para "${searchTerm}" com os filtros selecionados.`;
    } else if (searchTerm) {
      message = `Nenhum atleta encontrado para "${searchTerm}".`;
    } else if (filtersApplied) {
      message = "Nenhum atleta encontrado com os filtros selecionados.";
    }
    
    return <EmptyState message={message} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {filteredAthletes.map((athlete) => (
        <AthleteCard key={athlete.userId} athlete={athlete} onClick={() => setActiveTab(athlete.userId)} />
      ))}
    </div>
  );
};

export default AthleteResults;
