
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { AthleteProfile } from '@/types';
import { AthletePreferredLocationsProps } from './types';

const AthletePreferredLocations: React.FC<AthletePreferredLocationsProps> = ({
  preferredLocations = [],
  athlete
}) => {
  if (!preferredLocations || preferredLocations.length === 0) {
    return null;
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <MapPin className="h-5 w-5 mr-2" />
          Locais Preferidos
        </CardTitle>
        <CardDescription>
          Onde {athlete?.name || 'o atleta'} costuma jogar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {preferredLocations.map((location, index) => (
            <div
              key={index}
              className="bg-zinc-800 text-zinc-200 px-3 py-1 rounded-full text-sm"
            >
              {location}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AthletePreferredLocations;
