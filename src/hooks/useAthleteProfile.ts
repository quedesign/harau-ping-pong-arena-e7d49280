
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useAthlete } from '@/contexts/data/athlete';
import { AthleteProfile } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

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
        console.log('Athlete profile loaded:', profile);
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
      console.log('Updating profile with data:', data);
      
      // Convert available times and preferred locations to string arrays if they're strings
      let updatedData = { ...data };
      
      if (typeof updatedData.availableTimes === 'string') {
        updatedData.availableTimes = (updatedData.availableTimes as unknown as string)
          .split(',')
          .map(time => time.trim());
      }
      
      if (typeof updatedData.preferredLocations === 'string') {
        updatedData.preferredLocations = (updatedData.preferredLocations as unknown as string)
          .split(',')
          .map(location => location.trim());
      }
      
      // Update directly in Supabase for more reliable updates
      const updateData: any = {};
      
      if (updatedData.handedness) updateData.handedness = updatedData.handedness;
      if (updatedData.height !== undefined) updateData.height = updatedData.height;
      if (updatedData.weight !== undefined) updateData.weight = updatedData.weight;
      if (updatedData.level) updateData.level = updatedData.level;
      if (updatedData.bio !== undefined) updateData.bio = updatedData.bio;
      if (updatedData.yearsPlaying !== undefined) updateData.years_playing = updatedData.yearsPlaying;
      if (updatedData.wins !== undefined) updateData.wins = updatedData.wins;
      if (updatedData.losses !== undefined) updateData.losses = updatedData.losses;
      if (updatedData.playingStyle) updateData.playing_style = updatedData.playingStyle;
      if (updatedData.gripStyle) updateData.grip_style = updatedData.gripStyle;
      if (updatedData.playFrequency) updateData.play_frequency = updatedData.playFrequency;
      if (updatedData.tournamentParticipation) updateData.tournament_participation = updatedData.tournamentParticipation;
      if (updatedData.club) updateData.club = updatedData.club;
      if (updatedData.availableTimes) updateData.available_times = updatedData.availableTimes;
      if (updatedData.preferredLocations) updateData.preferred_locations = updatedData.preferredLocations;
      
      if (updatedData.location) {
        if (updatedData.location.city) updateData.city = updatedData.location.city;
        if (updatedData.location.state) updateData.state = updatedData.location.state;
        if (updatedData.location.country) updateData.country = updatedData.location.country;
      }
      
      if (updatedData.equipment) {
        if (updatedData.equipment.racket) updateData.racket = updatedData.equipment.racket;
        if (updatedData.equipment.rubbers) updateData.rubbers = updatedData.equipment.rubbers;
      }
      
      console.log('Supabase update data:', updateData);
      
      const { error } = await supabase
        .from('athlete_profiles')
        .update(updateData)
        .eq('user_id', currentUser.id);
      
      if (error) throw error;
      
      // Refresh profile to get the latest data
      const updatedProfile = await getAthleteProfile(currentUser.id);
      setAthleteProfile(updatedProfile || null);
      
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
