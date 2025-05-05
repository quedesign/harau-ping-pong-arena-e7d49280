
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface LocationFilterProps {
  filters: Record<string, string[]>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

const LocationFilter: React.FC<LocationFilterProps> = ({ filters, setFilters }) => {
  const [locationInput, setLocationInput] = useState("");
  const suggestedLocations = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Porto Alegre", "Curitiba", "Salvador"];
  
  const addLocation = () => {
    if (locationInput.trim()) {
      setFilters((prevFilters) => {
        const currentLocations = prevFilters.location || [];
        if (!currentLocations.includes(locationInput.trim())) {
          return {
            ...prevFilters,
            location: [...currentLocations, locationInput.trim()],
          };
        }
        return prevFilters;
      });
      setLocationInput("");
    }
  };

  const toggleFilter = (location: string) => {
    setFilters((prevFilters) => {
      const currentLocations = prevFilters.location || [];
      const isSelected = currentLocations.includes(location);

      if (isSelected) {
        return {
          ...prevFilters,
          location: currentLocations.filter((l) => l !== location),
        };
      } else {
        return {
          ...prevFilters,
          location: [...currentLocations, location],
        };
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input 
          placeholder="Digite uma localização" 
          value={locationInput} 
          onChange={(e) => setLocationInput(e.target.value)}
          className="bg-zinc-800 border-zinc-700"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addLocation();
              e.preventDefault();
            }
          }}
        />
        <Button 
          variant="outline" 
          onClick={addLocation}
          className="shrink-0"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      <div>
        <p className="text-sm text-zinc-400 mb-2">Sugestões:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedLocations.map((location) => (
            <Badge
              key={location}
              onClick={() => toggleFilter(location)}
              className={`cursor-pointer ${
                filters.location?.includes(location)
                  ? "bg-primary text-primary-foreground"
                  : "bg-zinc-800 text-zinc-400 border-zinc-700"
              }`}
              variant="outline"
            >
              {location}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationFilter;
