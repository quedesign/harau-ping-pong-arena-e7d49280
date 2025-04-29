import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface AthletePreferredTimesProps {
  availableTimes: string[];
}

const AthletePreferredTimes = ({ availableTimes }: AthletePreferredTimesProps) => {
  if (!availableTimes || availableTimes.length === 0) {
    return null;
  }
  
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
        <Calendar size={16} />
        Horários disponíveis
      </h3>

      <div className="bg-zinc-800 p-3 rounded-md text-sm">
        <ul className="list-disc list-inside space-y-1">
          {availableTimes.map((time, index) => (
            <li key={index} className="text-zinc-300">
              {time}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AthletePreferredTimes;