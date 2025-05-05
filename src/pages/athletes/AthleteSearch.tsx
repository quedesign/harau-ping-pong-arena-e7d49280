import { useState, useEffect, useMemo, useCallback } from "react";
import Layout from "@/components/layout/Layout";
import { useAthlete } from "@/contexts/data/athlete";
import { SearchBar, EmptyState, AthleteCard } from "@/components";
import FilterSection from "@/components/athletes/FilterSection"
import { FloatingSupportButton } from "@/components/FloatingSupportButton";
import RecentAthletes from "@/components/athletes/search/RecentAthletes";
import SearchFilters from "@/components/athletes/search/SearchFilters";
import AthleteResults from "@/components/athletes/search/AthleteResults";

const AthleteSearch = () => {
  const setActiveTab = useCallback(() => {}, []);
  
  const { athleteProfiles, loading } = useAthlete();
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

  const recentAthletes = useMemo(() => {
    if (!athleteProfiles) return []; 
    return [...athleteProfiles].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    }).slice(0, 6);
  }, [athleteProfiles]);

  if (loading) {
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

<<<<<<< HEAD
         {/* Recent Athletes Section */}
         <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Atletas Recentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {recentAthletes.map((athlete) => (
                 <AthleteCard key={athlete.userId} athlete={athlete} />
             ))}
          </div>
        </section>
        {/* Search and Filter Section */}
        <div className="mb-6">
          <SearchBar setSearchTerm={setSearchTerm} placeholder="Buscar atletas" />
          <FilterSection title="Filtros" filters={filters} setFilters={setFilters} />
        </div>
         <div className="mb-8">
            {noResults ? (
              <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
                <div className="mx-auto h-12 w-12 text-zinc-600 mb-4">🏓</div>
                <h3 className="text-xl font-medium mb-2">Nenhum atleta encontrado</h3>
                <p className="text-zinc-400 mb-6">
                  {searchTerm || Object.keys(filters).length > 0
                    ? "Nenhum atleta corresponde aos critérios de busca"
                    : "Não há atletas cadastrados no momento"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAthletes.map((athlete) => (
                  <AthleteCard key={athlete.userId} athlete={athlete} />
                ))}
              </div>
            )}
         
        </div>
      </div>      
=======
        {/* Recent Athletes Section */}
        <RecentAthletes athletes={recentAthletes} />

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
>>>>>>> bea1dda79a5a82f7c868202226671f7011b605fb
      <FloatingSupportButton />
    </Layout>
  );
};

export default AthleteSearch;
