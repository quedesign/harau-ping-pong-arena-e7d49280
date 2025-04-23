
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { useData } from '@/contexts/DataContext';
import { Tournament } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, GripVertical } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

interface SeedingSectionProps {
  tournament: Tournament;
}

const SeedingSection = ({ tournament }: SeedingSectionProps) => {
  const { t } = useTranslation();
  const { athleteProfiles, updateTournament } = useData();
  const [loading, setLoading] = useState(false);
  const [athletes, setAthletes] = useState(() => 
    tournament.registeredParticipants.map((id, index) => {
      const profile = athleteProfiles.find(profile => profile.userId === id);
      return {
        id,
        name: `Atleta ${id}`, // Mock name
        level: profile?.level || 'beginner',
        wins: profile?.wins || 0,
        losses: profile?.losses || 0,
        isSeeded: false,
        position: index + 1
      };
    })
  );

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedAthletes = [...athletes];
    const [movedAthlete] = reorderedAthletes.splice(result.source.index, 1);
    reorderedAthletes.splice(result.destination.index, 0, movedAthlete);
    
    // Update positions
    const updatedAthletes = reorderedAthletes.map((athlete, index) => ({
      ...athlete,
      position: index + 1
    }));
    
    setAthletes(updatedAthletes);
  };

  const toggleSeed = (athleteId: string) => {
    setAthletes(prev => 
      prev.map(a => 
        a.id === athleteId ? { ...a, isSeeded: !a.isSeeded } : a
      )
    );
  };

  const handleSaveSeeding = async () => {
    setLoading(true);
    try {
      // In a real app, you would send this data to the server
      // For now, we'll just show a toast
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      // Create a new order of participants based on seeding
      const seededAthletes = [...athletes].sort((a, b) => {
        // Seeded athletes come first
        if (a.isSeeded && !b.isSeeded) return -1;
        if (!a.isSeeded && b.isSeeded) return 1;
        
        // Then by position
        return a.position - b.position;
      });
      
      // Extract just the IDs in the new order
      const newOrder = seededAthletes.map(a => a.id);
      
      // Update tournament
      await updateTournament(tournament.id, { 
        registeredParticipants: newOrder 
      });
      
      toast({
        title: t('admin.seedingSaved'),
        description: t('admin.seedingSavedSuccess'),
      });
    } catch (error) {
      console.error("Error saving seeding:", error);
      toast({
        title: t('common.error'),
        description: t('admin.seedingError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>{t('admin.seedingAthletes')}</CardTitle>
        <CardDescription>
          {t('admin.arrangeSeedingDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6 bg-blue-500/10 border-blue-500/20">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertTitle>{t('admin.seedingInfo')}</AlertTitle>
          <AlertDescription>
            {t('admin.seedingInfoDescription')}
          </AlertDescription>
        </Alert>
      
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">{t('admin.athleteOrder')}</h3>
            <Button onClick={handleSaveSeeding} disabled={loading}>
              {loading ? t('common.saving') : t('common.save')}
            </Button>
          </div>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="athletes">
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {athletes.map((athlete, index) => (
                    <Draggable 
                      key={athlete.id} 
                      draggableId={athlete.id} 
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center justify-between p-3 rounded-md ${
                            athlete.isSeeded 
                              ? 'bg-yellow-500/10 border border-yellow-500/20' 
                              : 'bg-black border border-zinc-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="text-zinc-500" />
                            </div>
                            
                            <div>
                              <div className="font-medium">
                                {athlete.name}
                                {athlete.isSeeded && (
                                  <Star className="h-4 w-4 text-yellow-500 inline ml-2" />
                                )}
                              </div>
                              <div className="text-sm text-zinc-400">
                                {t('admin.record')}: {athlete.wins}-{athlete.losses}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-zinc-400 mr-2">
                              {t('admin.seedAthlete')}
                            </span>
                            <Switch 
                              checked={athlete.isSeeded}
                              onCheckedChange={() => toggleSeed(athlete.id)}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeedingSection;
