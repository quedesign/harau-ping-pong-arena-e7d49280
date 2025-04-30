import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface LocationFilterProps {
  filters: Record<string, string[]>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

const LocationFilter: React.FC<LocationFilterProps> = ({ filters, setFilters }) => {
  const locations = ["City A", "City B", "City C", "City D", "City E"];

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
    <div className="flex flex-wrap gap-2">
      {locations.map((location) => (
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
  );
};

export default LocationFilter;