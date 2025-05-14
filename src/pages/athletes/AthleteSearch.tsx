
import { useState, useEffect, useMemo, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import { useAthlete } from '@/contexts/data/athlete';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components';
import SearchBar from '@/components/athletes/SearchBar';
import { FloatingSupportButton } from '@/components/FloatingSupportButton';
import SearchFilters from '@/components/athletes/search/SearchFilters';
import AthleteResults from '@/components/athletes/search/AthleteResults';

// Fixed the missing FilterSection import
const FilterSection = ({ title, children }: { title: string, children: React.ReactNode }) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      {children}
    </div>
  );
};
  
const AthleteSearch = () => {
  const setActiveTab = useCallback(() => {}, []);
  
  const { athleteProfiles, isLoading } = useAthlete();
  const [noResults, setNoResults] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredAthletes = useMemo(() => {
    if (!athleteProfiles) return [];
    
    // Apply filters
    let athletesToFilter = athleteProfiles;
    
    if (Object.keys(filters).length > 0) {
      athletesToFilter = athleteProfiles.filter((athlete) => {
        return Object.keys(filters).every((filterKey) => {
          if (!filters[filterKey].length) {
            return true; // No filter selected for this key
          }
          
          if (filterKey === "level") {
            return filters[filterKey].includes(athlete.level || "");
          }
          
          if (filterKey === "playingStyle") {
            return filters[filterKey].includes(athlete.playingStyle || "");
          }
          
          if (filterKey === "location") {
            return filters[filterKey].some(location => 
              athlete.location?.city?.includes(location) || 
              athlete.location?.country?.includes(location)
            );
          }
          
          return true;
        });
      });
    }

    // Apply search term
    if (searchTerm) {
      athletesToFilter = athletesToFilter.filter((athlete) => {
        return (athlete?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
               (athlete.location?.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
               (athlete.location?.country || "").toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    return athletesToFilter;
  }, [athleteProfiles, filters, searchTerm]);

  useEffect(() => {
    setNoResults(filteredAthletes.length === 0);
  }, [filteredAthletes]);

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  const filtersApplied = Object.values(filters).some(values => values.length > 0);

  return (
    <Layout>
      <div className="mb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Encontre um atleta</h1>
          <p className="text-zinc-400">Encontre atletas pelo nome, nível, localização e estilo de jogo</p>
        </div>
  
        {/* Search and Filter Section */}
        <SearchFilters
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
        />
  
        {/* Athletes Results */}
        <AthleteResults
          filteredAthletes={filteredAthletes}
          noResults={noResults}
          searchTerm={searchTerm}
          filtersApplied={filtersApplied}
          setActiveTab={setActiveTab}
        />
      </div>
    <FloatingSupportButton />
    </Layout>
  );
};

export default AthleteSearch;
