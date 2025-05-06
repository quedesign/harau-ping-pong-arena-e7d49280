
import { useState } from "react";
import SearchBar from "@/components/athletes/SearchBar";
import FilterSection from "@/components/athletes/FilterSection";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface SearchFiltersProps {
  setSearchTerm: (term: string) => void;
  filters: Record<string, string[]>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  setSearchTerm,
  filters,
  setFilters,
}) => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  const totalFiltersApplied = Object.values(filters).reduce(
    (count, filterValues) => count + filterValues.length,
    0
  );

  return (
    <div className="mb-6">
      <div className="flex gap-2 items-center mb-4">
        <div className="flex-1">
          <SearchBar setSearchTerm={setSearchTerm} label="Buscar atletas" />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsFilterDrawerOpen(true)}
          className="flex items-center h-10"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtros
          {totalFiltersApplied > 0 && (
            <span className="ml-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {totalFiltersApplied}
            </span>
          )}
        </Button>
      </div>
      <FilterSection 
        title="Filtros" 
        filters={filters} 
        setFilters={setFilters} 
        isFilterDrawerOpen={isFilterDrawerOpen}
        setIsFilterDrawerOpen={setIsFilterDrawerOpen}
      />
    </div>
  );
};

export default SearchFilters;
