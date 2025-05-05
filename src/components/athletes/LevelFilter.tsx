
import { Badge } from "@/components/ui/badge";

interface LevelFilterProps {
  filters: Record<string, string[]>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

const LevelFilter: React.FC<LevelFilterProps> = ({ filters, setFilters }) => {
  const levels = ["beginner", "intermediate", "advanced", "professional"];
  const levelLabels: Record<string, string> = {
    "beginner": "Iniciante",
    "intermediate": "Intermediário",
    "advanced": "Avançado",
    "professional": "Profissional"
  };

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
          {levelLabels[level] || level}
        </Badge>
      ))}
    </div>
  );
};

export default LevelFilter;
