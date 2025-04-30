import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface SearchBarProps {
  setSearchTerm: (term: string) => void;
  label: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ setSearchTerm, label }) => {
  const [searchTerm, setSearchTermInternal] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTermInternal(newSearchTerm);
    setSearchTerm(newSearchTerm);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="search">{label}</Label>
      <Input
        type="text"
        id="search"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar;