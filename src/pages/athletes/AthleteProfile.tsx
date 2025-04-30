
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAthlete } from '@/contexts/data/athlete';
import Layout from '@/components/layout/Layout';
import AthleteProfileHeader from '@/components/athlete/AthleteProfileHeader';
import AthleteProfileCard from '@/components/athlete/AthleteProfileCard';
import AthleteStats from '@/components/athlete/AthleteStats';
import AthleteMatches from '@/components/athlete/AthleteMatches';
import AthleteTournaments from '@/components/athlete/AthleteTournaments';
import AthleteEquipments from '@/components/athlete/AthleteEquipments';
import AthletePreferredLocations from '@/components/athlete/AthletePreferredLocations';
import AthletePreferredTimes from '@/components/athlete/AthletePreferredTimes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AthleteProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAthleteById, isLoading } = useAthlete();

  // Get the athlete from context
  const athlete = id ? getAthleteById(id) : null;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!athlete) {
    return (
      <Layout>
        <div className="container max-w-4xl py-6">
          <div className="text-center my-10">
            <h2 className="text-2xl font-semibold">Atleta não encontrado</h2>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-5xl py-6">
        <AthleteProfileHeader athlete={athlete} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1 space-y-6">
            <AthleteProfileCard athlete={athlete} />
            <AthleteStats athlete={athlete} />
            <AthleteEquipments athlete={athlete} />
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="tournaments">
              <TabsList className="w-full">
                <TabsTrigger value="tournaments" className="flex-1">Torneios</TabsTrigger>
                <TabsTrigger value="matches" className="flex-1">Partidas</TabsTrigger>
                <TabsTrigger value="availability" className="flex-1">Disponibilidade</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tournaments" className="mt-4">
                <AthleteTournaments athleteId={athlete.id} />
              </TabsContent>
              
              <TabsContent value="matches" className="mt-4">
                <AthleteMatches athleteId={athlete.id} />
              </TabsContent>
              
              <TabsContent value="availability" className="mt-4 space-y-6">
                <AthletePreferredLocations athlete={athlete} />
                <AthletePreferredTimes athlete={athlete} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AthleteProfile;
