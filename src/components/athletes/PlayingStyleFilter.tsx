import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface PlayingStyleFilterProps {
  filters: Record<string, string[]>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

const PlayingStyleFilter: React.FC<PlayingStyleFilterProps> = ({ filters, setFilters }) => {
  const playingStyles = ["offensive", "defensive", "all-around"];

  const toggleFilter = (playingStyle: string) => {
    setFilters((prevFilters) => {
      const currentPlayingStyles = prevFilters.playingStyle || [];
      const isSelected = currentPlayingStyles.includes(playingStyle);

      if (isSelected) {
        return {
          ...prevFilters,
          playingStyle: currentPlayingStyles.filter((l) => l !== playingStyle),
        };
      } else {
        return {
          ...prevFilters,
          playingStyle: [...currentPlayingStyles, playingStyle],
        };
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {playingStyles.map((playingStyle) => (
        <Badge
          key={playingStyle}
          onClick={() => toggleFilter(playingStyle)}
          className={`cursor-pointer ${
            filters.playingStyle?.includes(playingStyle)
              ? "bg-primary text-primary-foreground"
              : "bg-zinc-800 text-zinc-400 border-zinc-700"
          }`}
          variant="outline"
        >
          {playingStyle}
        </Badge>
      ))}
    </div>
  );
};

export default PlayingStyleFilter;