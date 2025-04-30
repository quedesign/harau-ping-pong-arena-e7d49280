import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import SearchBar from "@/components/athletes/SearchBar";
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
    const allAthletes: Athlete[] = [
        { id: '1', name: 'Athlete 1', level: 'beginner', location: 'City A', playingStyle: 'offensive' },
        { id: '2', name: 'Athlete 2', level: 'intermediate', location: 'City B', playingStyle: 'defensive' },
        { id: '3', name: 'Athlete 3', level: 'advanced', location: 'City C', playingStyle: 'all-around' },
        { id: '4', name: 'Athlete 4', level: 'beginner', location: 'City D', playingStyle: 'offensive' },
        { id: '5', name: 'Athlete 5', level: 'intermediate', location: 'City E', playingStyle: 'defensive' },
        { id: '6', name: 'Athlete 6', level: 'advanced', location: 'City A', playingStyle: 'all-around' },
    ];

    const [noResults, setNoResults] = useState<boolean>(false);
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredAthletes = useMemo(() => {
        let athletesToFilter = allAthletes;

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
    return (
    <div className="p-6">
      <RecentAthletes athletes={recentAthletes}/>
      <h1 className="text-3xl font-bold mb-6">Localizar Atletas</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {athletes.map((athlete) => (
              <div key={athlete.id} className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
                  <h2 className="font-semibold">{athlete.name}</h2>
                <p className="text-zinc-400 text-sm">{athlete.level}</p>
                <p className="text-zinc-400 text-sm">{athlete.location}</p>
                <p className="text-zinc-400 text-sm">{athlete.playingStyle}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default AthleteSearch;