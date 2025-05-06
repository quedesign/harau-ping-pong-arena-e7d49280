
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { UserCog, Key, Award, Badge } from 'lucide-react';
import ProfileTab from '@/components/profile/ProfileTab';
import SecurityTab from '@/components/profile/SecurityTab';
import SportsDataTab from '@/components/profile/SportsDataTab';
import EquipmentTab from '@/components/profile/EquipmentTab';
import { AthleteProfile, User } from '@/types';
import { useUserProfile } from '@/hooks/useUserProfile';

interface MyProfileTabsProps {
  currentUser: User;
  athleteProfile: AthleteProfile | null;
  onUpdateSportsData: (data: Partial<AthleteProfile>) => void;
  onUpdateEquipment: (equipment: { racket?: string; rubbers?: string }) => void;
}

const MyProfileTabs = ({ 
  currentUser, 
  athleteProfile, 
  onUpdateSportsData, 
  onUpdateEquipment 
}: MyProfileTabsProps) => {
  const { t } = useTranslation();
  const { updateUserProfile, updatePassword } = useUserProfile();

  return (
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
        <ProfileTab currentUser={currentUser} onUpdate={updateUserProfile} />
      </TabsContent>

      <TabsContent value="security">
        <SecurityTab onPasswordChange={updatePassword} />
      </TabsContent>

      {currentUser.role === 'athlete' && (
        <>
          <TabsContent value="sportsData">
            <SportsDataTab 
              profile={athleteProfile} 
              onUpdate={onUpdateSportsData} 
            />
          </TabsContent>
          
          <TabsContent value="equipment">
            <EquipmentTab 
              equipment={athleteProfile?.equipment} 
              onUpdate={onUpdateEquipment} 
            />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};

export default MyProfileTabs;
