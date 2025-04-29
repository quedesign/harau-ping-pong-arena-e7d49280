
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { AthleteProfile } from '@/types';
import SportsDataForm from './sports-data/SportsDataForm';
import { SportsDataFormValues } from './sports-data/schema';

interface SportsDataTabProps {
  profile: AthleteProfile | null;
  onUpdate: (data: Partial<AthleteProfile>) => void;
}

const SportsDataTab = ({ profile, onUpdate }: SportsDataTabProps) => {
  const handleSubmit = (values: SportsDataFormValues) => {
    const { availableTimesString, preferredLocationsString, ...rest } = values;
    
    // Convert the strings back to arrays and handle yearsPlaying
    const formData: Partial<AthleteProfile> = {
      ...rest,
      availableTimes: availableTimesString ? availableTimesString.split(',').map(s => s.trim()) : undefined,
      preferredLocations: preferredLocationsString ? preferredLocationsString.split(',').map(s => s.trim()) : undefined,
    };
    
    onUpdate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados Esportivos</CardTitle>
        <CardDescription>
          Atualize suas informações esportivas para encontrar parceiros de jogo compatíveis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SportsDataForm profile={profile} onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
};

export default SportsDataTab;
