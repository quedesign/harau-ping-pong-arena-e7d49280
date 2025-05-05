
import { useState } from "react";
import SearchBar from "@/components/athletes/SearchBar";
import FilterSection from "@/components/athletes/FilterSection";

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
  return (
    <div className="mb-6">
      <SearchBar setSearchTerm={setSearchTerm} label="Buscar atletas" />
      <FilterSection title="Filtros" filters={filters} setFilters={setFilters} />
    </div>
  );
};

export default SearchFilters;
