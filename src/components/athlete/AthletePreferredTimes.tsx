
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { AthleteProfile } from '@/types';
import { AthletePreferredTimesProps } from './types';

const AthletePreferredTimes: React.FC<AthletePreferredTimesProps> = ({
  availableTimes = [],
  athlete
}) => {
  if (!availableTimes || availableTimes.length === 0) {
    return null;
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Clock className="h-5 w-5 mr-2" />
          Horários Disponíveis
        </CardTitle>
        <CardDescription>
          Quando {athlete?.name || 'o atleta'} costuma jogar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {availableTimes.map((time, index) => (
            <div
              key={index}
              className="bg-zinc-800 text-zinc-200 px-3 py-1 rounded-full text-sm"
            >
              {time}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AthletePreferredTimes;
