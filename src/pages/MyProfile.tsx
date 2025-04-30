
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { UserCog, Key, Award, Badge } from 'lucide-react';
import ProfileTab from '@/components/profile/ProfileTab';
import SecurityTab from '@/components/profile/SecurityTab';
import SportsDataTab from '@/components/profile/SportsDataTab';
import EquipmentTab from '@/components/profile/EquipmentTab';
import { useAthlete } from '@/contexts/data/athlete';
import { AthleteProfile } from '@/types';

const MyProfile = () => {
  const { currentUser } = useAuth();
  const { getAthleteProfile, updateAthleteProfile } = useAthlete();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [athleteProfile, setAthleteProfile] = useState<AthleteProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        if (currentUser.role === 'athlete') {
          const profile = await getAthleteProfile(currentUser.id);
          setAthleteProfile(profile || null);
        }
      } catch (error) {
        console.error("Error fetching athlete profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser, getAthleteProfile, navigate]);

  if (!currentUser) {
    return null;
  }

  const handleUpdateProfile = (name: string, email: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: { id: string }) => u.id === currentUser.id);

    if (userIndex >= 0) {
      users[userIndex] = {
        ...users[userIndex],
        name,
        email,
      };

      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('harauAuth', JSON.stringify({ ...currentUser, name, email }));

      toast({
        title: t('common.success'),
        description: t('profile.updateSuccess'),
      });
    }
  };

  const handlePasswordChange = (currentPassword: string, newPassword: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: { id: string; password?: string }) => u.id === currentUser.id);

    if (userIndex >= 0 && users[userIndex].password === currentPassword) {
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      
      toast({
        title: t('common.success'),
        description: t('profile.passwordUpdateSuccess'),
      });
    } else {
      toast({
        title: t('common.error'),
        description: t('auth.currentPasswordIncorrect'),
        variant: 'destructive',
      });
    }
  };

  const handleUpdateSportsData = async (data: Partial<AthleteProfile>) => {
    if (!currentUser || !athleteProfile) return;
    
    try {
      const updatedProfile = await updateAthleteProfile(currentUser.id, data);
      setAthleteProfile(updatedProfile);
      
      toast({
        title: t('common.success'),
        description: 'Dados esportivos atualizados com sucesso',
      });
    } catch (error) {
      console.error("Error updating sports data:", error);
      toast({
        title: t('common.error'),
        description: 'Erro ao atualizar dados esportivos',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateEquipment = async (equipment: { racket?: string; rubbers?: string }) => {
    if (!currentUser || !athleteProfile) return;
    
    try {
      const updatedProfile = await updateAthleteProfile(currentUser.id, { equipment });
      setAthleteProfile(updatedProfile);
      
      toast({
        title: t('common.success'),
        description: 'Dados de equipamento atualizados com sucesso',
      });
    } catch (error) {
      console.error("Error updating equipment:", error);
      toast({
        title: t('common.error'),
        description: 'Erro ao atualizar dados de equipamento',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl py-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <UserCog className="h-4 w-4 mr-2" />
              {t('profile.personalInfo')}
            </TabsTrigger>
            <TabsTrigger value="security">
              <Key className="h-4 w-4 mr-2" />
              {t('profile.security')}
            </TabsTrigger>
            {currentUser.role === 'athlete' && (
              <>
                <TabsTrigger value="sportsData">
                  <Award className="h-4 w-4 mr-2" />
                  Dados Esportivos
                </TabsTrigger>
                <TabsTrigger value="equipment">
                  <Badge className="h-4 w-4 mr-2" />
                  Equipamentos
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="profile">
            <ProfileTab currentUser={currentUser} onUpdate={handleUpdateProfile} />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab onPasswordChange={handlePasswordChange} />
          </TabsContent>

          {currentUser.role === 'athlete' && (
            <>
              <TabsContent value="sportsData">
                <SportsDataTab 
                  profile={athleteProfile} 
                  onUpdate={handleUpdateSportsData} 
                />
              </TabsContent>
              
              <TabsContent value="equipment">
                <EquipmentTab 
                  equipment={athleteProfile?.equipment} 
                  onUpdate={handleUpdateEquipment} 
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyProfile;
