import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BadgeIcon } from 'lucide-react';
import { AthleteEquipment } from '@/types';

interface AthleteEquipmentsProps {
  equipment: AthleteEquipment;
}

const AthleteEquipments: React.FC<AthleteEquipmentsProps> = ({ equipment }) => {
  if (!equipment?.racket && !equipment?.rubbers) {
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
          {equipment.racket && (
            <div className="bg-zinc-800 p-3 rounded-md text-sm">
              <p className="text-zinc-400 mb-1">Raquete:</p>
              <p>{equipment.racket}</p>
            </div>
          )}

          {equipment.rubbers && (
            <div className="bg-zinc-800 p-3 rounded-md text-sm">
              <p className="text-zinc-400 mb-1">Borrachas:</p>
              <p>{equipment.rubbers}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AthleteEquipments;