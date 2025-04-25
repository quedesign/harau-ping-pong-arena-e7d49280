
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { Shield, UserCog, Key } from 'lucide-react';
import ProfileTab from '@/components/profile/ProfileTab';
import SecurityTab from '@/components/profile/SecurityTab';
import SkillsTab from '@/components/profile/SkillsTab';

const MyProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [skills, setSkills] = useState({
    handedness: 'right',
    level: 'beginner',
    yearsPlaying: '0',
    playingStyle: '',
  });

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleUpdateProfile = (name: string, email: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === currentUser.id);

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
    const userIndex = users.findIndex((u: any) => u.id === currentUser.id);

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

  const handleUpdateSkills = (newSkills: typeof skills) => {
    setSkills(newSkills);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === currentUser.id);

    if (userIndex >= 0) {
      users[userIndex] = {
        ...users[userIndex],
        skills: newSkills,
      };

      localStorage.setItem('users', JSON.stringify(users));
      
      toast({
        title: t('common.success'),
        description: t('profile.skillsUpdateSuccess'),
      });
    }
  };

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
            <TabsTrigger value="skills">
              <Shield className="h-4 w-4 mr-2" />
              {t('profile.skills')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileTab currentUser={currentUser} onUpdate={handleUpdateProfile} />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab onPasswordChange={handlePasswordChange} />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsTab initialSkills={skills} onUpdate={handleUpdateSkills} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyProfile;
