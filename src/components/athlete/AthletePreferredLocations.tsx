import { MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AthletePreferredLocationsProps {
  preferredLocations: string[];
}

const AthletePreferredLocations: React.FC<AthletePreferredLocationsProps> = ({ preferredLocations }) => {
  if (!preferredLocations || preferredLocations.length === 0) {
    return null;
  }

  return (
    <>      
      <Separator className="my-6" />

      <div className="w-full">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <MapPin size={16} />
          Locais preferidos
        </h3>

        <div className="bg-zinc-800 p-3 rounded-md text-sm">
          <ul className="list-disc list-inside space-y-1">
            {preferredLocations.map((loc, index) => (
              <li key={index} className="text-zinc-300">{loc}</li>
            ))}
          </ul>
          </div>
      </div>
    </>
  );
};

export default AthletePreferredLocations;