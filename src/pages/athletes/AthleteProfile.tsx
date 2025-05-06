
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';
import { useAthlete } from '@/contexts/data/athlete';
import { AthleteProfile as AthleteProfileType } from '@/types';
import AthleteProfileHeader from '@/components/athlete/AthleteProfileHeader';
import AthleteProfileCard from '@/components/athlete/AthleteProfileCard';
import AthleteStats from '@/components/athlete/AthleteStats';
import AthleteEquipments from '@/components/athlete/AthleteEquipments';
import AthleteDetailsSection from '@/components/athlete/AthleteDetailsSection';
import AthleteTournaments from '@/components/athlete/AthleteTournaments';
import AthleteMatches from '@/components/athlete/AthleteMatches';
import AthletePreferredLocations from '@/components/athlete/AthletePreferredLocations';
import AthletePreferredTimes from '@/components/athlete/AthletePreferredTimes';
import { checkSupabaseConnection } from '@/integrations/supabase/client';

const AthleteProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { getAthleteProfile } = useAthlete();
  
  const [athlete, setAthlete] = useState<AthleteProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Verificar a conexão com o Supabase
    const checkConnection = async () => {
      const isConnected = await checkSupabaseConnection();
      setSupabaseConnected(isConnected);
    };
    
    checkConnection();
  }, []);

  useEffect(() => {
    const fetchAthleteProfile = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const profile = await getAthleteProfile(id);
        
        if (profile) {
          setAthlete(profile);
          setIsCurrentUser(currentUser?.id === profile.userId);
        } else {
          throw new Error('Athlete profile not found');
        }
      } catch (err) {
        console.error('Error fetching athlete profile:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchAthleteProfile();
  }, [id, currentUser, getAthleteProfile]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error || !athlete) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Profile not found</h2>
          <p className="text-gray-500">{error?.message || 'Could not load athlete profile'}</p>
          {supabaseConnected === false && (
            <p className="text-red-500 mt-4">
              Erro na conexão com o Supabase. Verifique suas credenciais.
            </p>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6">
        <AthleteProfileHeader athlete={athlete} athleteName={athlete.name} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="space-y-6">
            <AthleteProfileCard profile={athlete} athleteName={athlete.name} />
            <AthleteStats 
              wins={athlete.wins} 
              losses={athlete.losses} 
              stats={{
                totalMatches: 0,
                tournamentsPlayed: 0,
                longestStreak: '0 vitórias',
                winRate: athlete.wins > 0 ? Math.round((athlete.wins / (athlete.wins + athlete.losses)) * 100) : 0,
                averagePointsPerGame: 0,
                bestTournament: 'N/A'
              }} 
            />
            {athlete.equipment && (
              <AthleteEquipments equipment={athlete.equipment} athlete={athlete} />
            )}
          </div>
          
          <div className="md:col-span-2">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
                <TabsTrigger value="info">{t('athlete.information')}</TabsTrigger>
                <TabsTrigger value="tournaments">{t('athlete.tournaments')}</TabsTrigger>
                <TabsTrigger value="matches">{t('athlete.matches')}</TabsTrigger>
                <TabsTrigger value="availability">{t('athlete.availability')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="mt-4 space-y-4">
                <AthleteDetailsSection 
                  playingStyle={athlete.playingStyle}
                  gripStyle={athlete.gripStyle}
                  playFrequency={athlete.playFrequency}
                  tournamentParticipation={athlete.tournamentParticipation}
                  club={athlete.club}
                  height={athlete.height}
                  weight={athlete.weight}
                />
              </TabsContent>
              
              <TabsContent value="tournaments" className="mt-4">
                <AthleteTournaments athleteId={athlete.userId} tournaments={[]} />
              </TabsContent>
              
              <TabsContent value="matches" className="mt-4">
                <AthleteMatches athleteId={athlete.userId} />
              </TabsContent>
              
              <TabsContent value="availability" className="mt-4 space-y-6">
                {athlete.preferredLocations && (
                  <AthletePreferredLocations 
                    preferredLocations={athlete.preferredLocations} 
                    athlete={athlete} 
                  />
                )}
                {athlete.availableTimes && (
                  <AthletePreferredTimes 
                    availableTimes={athlete.availableTimes} 
                    athlete={athlete} 
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {supabaseConnected === false && (
          <div className="mt-8 p-4 bg-red-800/20 border border-red-800 rounded-md">
            <p className="text-red-400 font-medium">
              Atenção: Sua aplicação não está conectada ao Supabase corretamente. 
              Verifique suas credenciais na configuração do cliente Supabase.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AthleteProfile;
