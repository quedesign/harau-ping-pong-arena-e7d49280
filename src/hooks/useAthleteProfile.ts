
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useAthlete } from '@/contexts/data/athlete';
import { AthleteProfile } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export const useAthleteProfile = () => {
  const { currentUser } = useAuth();
  const { getAthleteProfile, updateAthleteProfile } = useAthlete();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [athleteProfile, setAthleteProfile] = useState<AthleteProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser?.id || currentUser.role !== 'athlete') {
        setAthleteProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const profile = await getAthleteProfile(currentUser.id);
        setAthleteProfile(profile || null);
      } catch (error) {
        console.error("Error fetching athlete profile:", error);
        toast({
          title: t('common.error'),
          description: t('profile.fetchError'),
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser, getAthleteProfile, toast, t]);

  const updateProfile = async (data: Partial<AthleteProfile>) => {
    if (!currentUser?.id || !athleteProfile) return null;
    
    try {
      const updatedProfile = await updateAthleteProfile(currentUser.id, data);
      setAthleteProfile(updatedProfile);
      
      toast({
        title: t('common.success'),
        description: t('profile.updateSuccess'),
      });
      
      return updatedProfile;
    } catch (error) {
      console.error("Error updating athlete profile:", error);
      toast({
        title: t('common.error'),
        description: t('profile.updateError'),
        variant: 'destructive',
      });
      return null;
    }
  };

  return { athleteProfile, loading, updateProfile };
};
