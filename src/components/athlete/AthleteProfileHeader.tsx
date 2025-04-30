
import React from "react";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AthleteProfileHeaderProps {
  athleteName: string;
  location: {
    city: string;
    country: string;
  };
  level: string;
  handedness: string;
  yearsPlaying?: number;
}

const formatLevel = (level: string): string => {
  switch (level) {
    case "beginner":
      return "Iniciante";
    case "intermediate":
      return "Intermediário";
    case "advanced":
      return "Avançado";
    default:
      return "Competidor federado";
  }
};

const formatHandedness = (handedness: string): string => {
  switch (handedness) {
    case "right":
      return "Destro";
    case "left":
      return "Canhoto";
    default:
      return "Ambidestro";
  }
};

const AthleteProfileHeader: React.FC<AthleteProfileHeaderProps> = ({ 
  athleteName,
  location,
  level,
  handedness,
  yearsPlaying
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center text-white mb-4">
        <span className="text-3xl font-semibold">
          {athleteName.charAt(0)}
        </span>
      </div>

      <h2 className="text-xl font-bold mb-1">{athleteName}</h2>
      <p className="text-zinc-400 text-sm flex items-center mb-4">
        <MapPin className="h-3.5 w-3.5 mr-1" />
        {location.city}, {location.country}
      </p>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <Badge
          variant="outline"
          className="bg-zinc-800 border-zinc-700"
        >
          {formatLevel(level)}
        </Badge>

        <Badge
          variant="outline"
          className="bg-zinc-800 border-zinc-700"
        >
          {formatHandedness(handedness)}
        </Badge>
        
        {yearsPlaying && (
          <Badge
            variant="outline"
            className="bg-zinc-800 border-zinc-700"
          >
            {yearsPlaying}{" "}
            {yearsPlaying === 1 ? "ano" : "anos"} de experiência
          </Badge>
        )}
      </div>
    </div>
  );
};

export default AthleteProfileHeader;
