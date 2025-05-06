
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BadgeIcon } from 'lucide-react';
import { AthleteEquipmentsProps } from './types';
import { AthleteEquipment } from '@/types';

const AthleteEquipments: React.FC<AthleteEquipmentsProps> = ({ equipment, athlete }) => {
  // Use equipment prop or get from athlete object
  const athleteEquipment = equipment || athlete?.equipment;
  
  if (!athleteEquipment?.racket && !athleteEquipment?.rubbers) {
    return null;
  }

  return (
    <>
      <Separator className="my-6" />

      <div className="w-full">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <BadgeIcon size={16} />
          Equipamentos
        </h3>

        <div className="space-y-3">
          {athleteEquipment.racket && (
            <div className="bg-zinc-800 p-3 rounded-md text-sm">
              <p className="text-zinc-400 mb-1">Raquete:</p>
              <p>{athleteEquipment.racket}</p>
            </div>
          )}

          {athleteEquipment.rubbers && (
            <div className="bg-zinc-800 p-3 rounded-md text-sm">
              <p className="text-zinc-400 mb-1">Borrachas:</p>
              <p>{athleteEquipment.rubbers}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AthleteEquipments;
