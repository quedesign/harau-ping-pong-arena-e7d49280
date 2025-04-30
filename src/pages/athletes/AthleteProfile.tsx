
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';
import Layout from '@/components/layout/Layout'
import { useAthlete } from '@/contexts/data/athlete';
import AthleteProfileHeader from '@/components/athlete/AthleteProfileHeader';
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { AthleteProfile as AthleteProfileType, Tournament } from '@/types';
import AthleteMatches from '@/components/athlete/AthleteMatches'
import { useMatchFetch } from '@/hooks/useMatchFetch';
import AthleteStats, { AthleteStatsData } from '@/components/athlete/AthleteStats';
import AthleteTournaments from '@/components/athlete/AthleteTournaments';
import AthleteProfileCard from '@/components/athlete/AthleteProfileCard';
import AthleteMatchRequest from '@/components/athlete/AthleteMatchRequest';

const AthleteProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAthleteProfile } = useAthlete();
  const [profile, setProfile] = useState<AthleteProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [athleteName, setAthleteName] = useState("Atleta");
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  // Mock tournaments for demonstration
  const mockTournaments: Tournament[] = [
    {
      id: "1",
      name: "Campeonato Regional",
      date: new Date(2023, 5, 15),
      result: "Semi-finalista"
    },
    {
      id: "2",
      name: "Copa Cidade",
      date: new Date(2023, 8, 22),
      result: "Campeão"
    }
  ];

  // Mock stats for demonstration
  const mockStats: AthleteStatsData = {
    totalMatches: 42,
    tournamentsPlayed: 7,
    longestStreak: "8 vitórias",
    winRate: 68,
    averagePointsPerGame: 11.5,
    bestTournament: "Copa Cidade"
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!id) {
        navigate('/athletes');
        return;
      }

      try {
        setLoading(true);
        const athleteProfile = await getAthleteProfile(id);
        
        if (athleteProfile) {
          setProfile(athleteProfile);
          setAthleteName(athleteProfile.name || "Atleta");
          // Check if this is the user's own profile
          setIsOwnProfile(user?.id === athleteProfile.userId);
        } else {
          // Perfil não encontrado
          navigate('/athletes');
        }
      } catch (error) {
        console.error("Error loading athlete profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id, navigate, user, getAthleteProfile]);

  const handleConnect = () => {
    // Implementar lógica de conexão entre atletas
    console.log("Solicitação de conexão enviada");
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <p>{t('loading')}...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t('athleteNotFound')}</h2>
            <button 
              className="bg-primary text-white px-4 py-2 rounded"
              onClick={() => navigate('/athletes')}
            >
              {t('backToAthletes')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <AthleteProfileHeader
          athleteName={athleteName}
          bio={profile.bio || ""}
          isOwnProfile={isOwnProfile}
          userId={profile.userId}
          onConnect={handleConnect}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <AthleteProfileCard 
              profile={profile} 
              athleteName={athleteName}
            />
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="matches" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="matches">Partidas</TabsTrigger>
                <TabsTrigger value="stats">Estatísticas</TabsTrigger>
                <TabsTrigger value="tournaments">Torneios</TabsTrigger>
              </TabsList>

              <TabsContent value="matches" className="border-none p-0">
                <AthleteMatches athleteId={profile.userId} />
                
                {!isOwnProfile && (
                  <div className="mt-6">
                    <AthleteMatchRequest 
                      athleteId={profile.userId}
                      athleteName={athleteName}
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="stats" className="border-none p-0">
                <AthleteStats stats={mockStats} />
              </TabsContent>

              <TabsContent value="tournaments" className="border-none p-0">
                <AthleteTournaments tournaments={mockTournaments} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AthleteProfile;
