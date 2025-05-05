
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
        <Input
          type="text"
          id="search"
          placeholder="Nome, cidade ou país..."
          value={searchTerm}
          onChange={handleInputChange}
          className="pl-10 bg-zinc-900 border-zinc-800"
        />
      </div>
    </div>
  );
};

export default SearchBar;
