import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface LevelFilterProps {
  filters: Record<string, string[]>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

const LevelFilter: React.FC<LevelFilterProps> = ({ filters, setFilters }) => {
  const levels = ["beginner", "intermediate", "advanced", "professional"];

  const toggleFilter = (level: string) => {
    setFilters((prevFilters) => {
      const currentLevels = prevFilters.level || [];
      const isSelected = currentLevels.includes(level);

      if (isSelected) {
        return {
          ...prevFilters,
          level: currentLevels.filter((l) => l !== level),
        };
      } else {
        return {
          ...prevFilters,
          level: [...currentLevels, level],
        };
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {levels.map((level) => (
        <Badge
          key={level}
          onClick={() => toggleFilter(level)}
          className={`cursor-pointer ${
            filters.level?.includes(level)
              ? "bg-primary text-primary-foreground"
              : "bg-zinc-800 text-zinc-400 border-zinc-700"
          }`}
          variant="outline"
        >
          {level}
        </Badge>
      ))}
    </div>
  );
};

export default LevelFilter;