
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useFollowing = (userId?: string) => {
  const [followedAthletes, setFollowedAthletes] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followingCount, setFollowingCount] = useState(0);
  const { toast } = useToast();

  const fetchFollowedAthletes = async () => {
    if (!userId) {
      setFollowedAthletes([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Using raw RPC function call
      const { data: followData, error: followError } = await supabase
        .rpc('get_athlete_followers', { user_id: userId });
      
      if (followError) throw followError;
      
      if (!followData || followData.length === 0) {
        setFollowedAthletes([]);
        setFollowingCount(0);
        setIsLoading(false);
        return;
      }
      
      // Specify the type of row explicitly
      const athleteIds = followData.map((row: { athlete_id: string }) => row.athlete_id);
      setFollowingCount(athleteIds.length);
      
      // Get user profiles for these athletes
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', athleteIds);
      
      if (profilesError) throw profilesError;
      
      const athletes: User[] = (profilesData || []).map(profile => ({
        id: profile.id,
        name: profile.name || '',
        email: profile.email || '',
        role: profile.role as User['role'],
        profileImage: profile.profile_image || undefined,
        createdAt: profile.created_at ? new Date(profile.created_at) : new Date()
      }));
      
      setFollowedAthletes(athletes);
    } catch (err) {
      console.error('Error fetching followed athletes:', err);
      setError('Erro ao carregar atletas seguidos');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os atletas seguidos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const followAthlete = async (athleteId: string) => {
    if (!userId) return false;
    
    try {
      // Using RPC function call
      const { data, error } = await supabase
        .rpc('follow_athlete', { 
          follower_user_id: userId, 
          athlete_user_id: athleteId 
        });
      
      if (error) throw error;
      
      await fetchFollowedAthletes();
      return true;
    } catch (err) {
      console.error('Error following athlete:', err);
      toast({
        title: "Erro",
        description: "Não foi possível seguir este atleta",
        variant: "destructive",
      });
      return false;
    }
  };

  const unfollowAthlete = async (athleteId: string) => {
    if (!userId) return false;
    
    try {
      // Using RPC function call
      const { data, error } = await supabase
        .rpc('unfollow_athlete', { 
          follower_user_id: userId, 
          athlete_user_id: athleteId 
        });
      
      if (error) throw error;
      
      await fetchFollowedAthletes();
      return true;
    } catch (err) {
      console.error('Error unfollowing athlete:', err);
      toast({
        title: "Erro",
        description: "Não foi possível deixar de seguir este atleta",
        variant: "destructive",
      });
      return false;
    }
  };

  const isFollowing = async (athleteId: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const { data, error } = await supabase
        .rpc('is_following_athlete', { 
          follower_user_id: userId, 
          athlete_user_id: athleteId 
        });
      
      if (error) throw error;
      
      return !!data;
    } catch (err) {
      console.error('Error checking follow status:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchFollowedAthletes();
  }, [userId]);

  return { 
    followedAthletes, 
    isLoading, 
    error, 
    followAthlete, 
    unfollowAthlete,
    isFollowing,
    followingCount,
    refresh: fetchFollowedAthletes
  };
};
