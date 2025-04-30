
import React from "react";
import { Award, Swords, Timer, Trophy, BadgeCheck, User, CircleUser } from "lucide-react";

interface AthleteDetailsSectionProps {
  playingStyle?: string;
  gripStyle?: string;
  playFrequency?: string;
  tournamentParticipation?: string;
  club?: string;
  height?: number;
  weight?: number;
}

const formatPlayingStyle = (playingStyle?: string): string => {
  if (!playingStyle) return "Não informado";
  
  switch (playingStyle) {
    case "offensive":
      return "Ofensivo";
    case "defensive":
      return "Defensivo";
    case "all-round":
      return "All-round";
    default:
      return playingStyle || "Não informado";
  }
};

const AthleteDetailsSection: React.FC<AthleteDetailsSectionProps> = ({
  playingStyle,
  gripStyle,
  playFrequency,
  tournamentParticipation,
  club,
  height,
  weight
}) => {
  return (
    <div className="w-full space-y-4">
      {playingStyle && (
        <div className="flex items-center gap-2">
          <Swords size={16} className="text-zinc-400"/>
          <span className="text-zinc-400">
            Estilo de jogo:
          </span>
          <span className="ml-auto">
            {formatPlayingStyle(playingStyle)}
          </span>
        </div>
      )}
      
      {gripStyle && (
        <div className="flex items-center gap-2">
          <Award size={16} className="text-zinc-400" />
          <span className="text-zinc-400">Empunhadura:</span>
          <span className="ml-auto">
            {gripStyle === "classic" ? "Clássica" : gripStyle === "penhold" ? "Caneta" : "Outras"}
          </span>
        </div>
      )}
      
      {playFrequency && (
        <div className="flex items-center gap-2">
          <Timer size={16} className="text-zinc-400" />
          <span className="text-zinc-400">Frequência:</span>
          <span className="ml-auto">
            {playFrequency === "once-a-week"
              ? "1x por semana"
              : playFrequency === "twice-or-more"
              ? "2x ou mais"
              : playFrequency === "weekends-only"
              ? "Fins de semana"
              : playFrequency === "monthly"
              ? "Mensalmente"
              : "Raramente"}
          </span>
        </div>
      )}

      {tournamentParticipation && (
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-zinc-400" />
          <span className="text-zinc-400">Torneios:</span>
          <span className="ml-auto">
            {tournamentParticipation === "yes"
              ? "Participa"
              : tournamentParticipation === "no"
              ? "Não participa"
              : "Ocasionalmente"}
          </span>
        </div>
      )}

      {club && (
        <div className="flex items-center gap-2">
          <BadgeCheck size={16} className="text-zinc-400" />
          <span className="text-zinc-400">Clube:</span>
          <span className="ml-auto">{club}</span>
        </div>
      )}

      {height && (
        <div className="flex items-center gap-2">
          <User size={16} className="text-zinc-400" />
          <span className="text-zinc-400">Altura:</span>
          <span className="ml-auto">{height} cm</span>
        </div>
      )}

      {weight && (
        <div className="flex items-center gap-2">
          <CircleUser size={16} className="text-zinc-400" />
          <span className="text-zinc-400">Peso:</span>
          <span className="ml-auto">{weight} kg</span>
        </div>
      )}
    </div>
  );
};

export default AthleteDetailsSection;
