
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAthleteProfile } from '@/hooks/useAthleteProfile';
import MyProfileTabs from '@/components/profile/MyProfileTabs';
import { AthleteProfile } from '@/types';

const MyProfile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { athleteProfile, loading, updateProfile } = useAthleteProfile();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const handleUpdateSportsData = async (data: Partial<AthleteProfile>) => {
    if (!currentUser.id || !athleteProfile) return;
    await updateProfile(data);
  };

  const handleUpdateEquipment = async (equipment: { racket?: string; rubbers?: string }) => {
    if (!currentUser.id || !athleteProfile) return;
    await updateProfile({ equipment });
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
        <MyProfileTabs 
          currentUser={currentUser}
          athleteProfile={athleteProfile}
          onUpdateSportsData={handleUpdateSportsData}
          onUpdateEquipment={handleUpdateEquipment}
        />
      </div>
    </Layout>
  );
};

export default MyProfile;
