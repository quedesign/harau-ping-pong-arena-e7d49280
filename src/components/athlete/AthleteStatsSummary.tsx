
import React from "react";

interface AthleteStatsSummaryProps {
  wins: number;
  losses: number;
}

const AthleteStatsSummary: React.FC<AthleteStatsSummaryProps> = ({ wins, losses }) => {
  return (
    <div className="w-full grid grid-cols-3 gap-2 text-center mb-6">
      <div className="bg-black p-3 rounded-md">
        <p className="text-primary text-xl font-bold">{wins}</p>
        <p className="text-xs text-zinc-400">Vitórias</p>
      </div>
      <div className="bg-black p-3 rounded-md">
        <p className="text-zinc-400 text-xl font-bold">{losses}</p>
        <p className="text-xs text-zinc-400">Derrotas</p>
      </div>
      <div className="bg-black p-3 rounded-md">
        <p className="text-lg font-bold">
          {wins + losses > 0
            ? Math.round((wins / (wins + losses)) * 100)
            : 0}
          <span className="text-xs">%</span>
        </p>
        <p className="text-xs text-zinc-400">Win Rate</p>
      </div>
    </div>
  );
};

export default AthleteStatsSummary;
