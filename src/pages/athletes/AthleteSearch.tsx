import { useState, useEffect, useMemo } from "react";
import SearchBar from "@/components/athletes/SearchBar";
import { Button } from '@/components/ui/button';
import { MessageCircle, PlusCircle } from 'lucide-react';
import { useGetAthletes } from '@/hooks/useGetAthletes';
import FilterSection from "@/components/athletes/FilterSection";
import RecentAthletes from "@/components/athletes/RecentAthletes";
import { Athlete } from "@/types";

const recentAthletes: Athlete[] = [
  { userId: "1", level: "beginner", location: {city:"city A", country: "country A"}, playingStyle: "offensive" },
  { userId: "2", level: "intermediate", location: {city:"city B", country: "country B"}, playingStyle: "defensive" },
  { userId: "3", level: "advanced", location: {city:"city C", country: "country C"}, playingStyle: "all-around" },
  { userId: "4", level: "beginner", location: {city:"city D", country: "country D"}, playingStyle: "offensive" },
  { userId: "5", level: "intermediate", location: {city:"city E", country: "country E"}, playingStyle: "defensive" },
  { userId: "6", level: "advanced", location: {city:"city F", country: "country F"}, playingStyle: "all-around" },
];

const AthleteSearch = () => {
    const { athletes : initialAthletes, isLoading, error } = useGetAthletes();
    
    const [noResults, setNoResults] = useState<boolean>(false);
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [searchTerm, setSearchTerm] = useState<string>('');
    const allAthletes: Athlete[] | undefined = athletes;
    const filteredAthletes = useMemo(() => {
        let athletesToFilter = allAthletes;
        if (!athletesToFilter) return [];
        // Apply filters
        if (Object.keys(filters).length > 0) {
            athletesToFilter = allAthletes.filter((athlete) => {
                return Object.keys(filters).every((filterKey) => {                    
                    if (!filters[filterKey].length) {
                        return true; // No filter selected for this key
                    }
                    return filters[filterKey].includes(athlete[filterKey as keyof Athlete]);
                });
            });
        }

        // Apply search term
        if (searchTerm) {
            athletesToFilter = athletesToFilter.filter((athlete) =>
                athlete.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return athletesToFilter;
        
    }, [filters, searchTerm]);

    useEffect(() => {
        setNoResults(filteredAthletes.length === 0);
    }, [filteredAthletes]);

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    
    if (!allAthletes) {
        return <div>No athletes found</div>;
      }
    
    return (
    <div className="p-6">
      <RecentAthletes athletes={recentAthletes}/>
      <h1 className="text-3xl font-bold mb-6">Encontre um atleta</h1>
      <div className="mb-6">
        {/* Search bar and filters will go here */}
        <SearchBar setSearchTerm={setSearchTerm} label="Buscar atletas" />
        

         <FilterSection
          title="Filtros"
          filters={filters}
          setFilters={setFilters}
        />
      </div>
      <div>
        {noResults ? (
          <p className="text-zinc-400">Nenhum atleta encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredAthletes.map((athlete) => (
              <div key={athlete.id} className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 flex flex-col items-center justify-between">
                  <div>
                    <h2 className="font-semibold">{athlete.name}</h2>
                    <p className="text-zinc-400 text-sm">{athlete.level}</p>
                    <p className="text-zinc-400 text-sm">{athlete.location}</p>
                    <p className="text-zinc-400 text-sm">{athlete.playingStyle}</p>
                    <p className="text-zinc-400 text-sm">Id: {athlete.id}</p>
                  </div>
                <div className="flex items-center justify-end">
                  <Button variant="outline" className="mr-2" size="icon"><PlusCircle className="mr-2 h-4 w-4" /></Button>
                  <Button variant="outline" size="icon"><MessageCircle className="mr-2 h-4 w-4" /></Button>
                </div>
              </div>
            ))
            }
          </div>
        )}
      </div>
    </div>
  );
};
export default AthleteSearch;