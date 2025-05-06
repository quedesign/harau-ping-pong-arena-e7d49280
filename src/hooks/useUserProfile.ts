
import { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

export const useUserProfile = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateUserProfile = async (user: User) => {
    if (!currentUser?.id) return;
    
    setIsUpdating(true);
    try {
      // Update user profile in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          name: user.name,
          email: user.email,
          profile_image: user.profileImage
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      // Update local state
      if (setCurrentUser) {
        setCurrentUser({
          ...currentUser,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage
        });
      }

      toast({
        title: t('common.success'),
        description: t('profile.updateSuccess'),
      });
      
      return true;
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast({
        title: t('common.error'),
        description: t('profile.updateError'),
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: t('common.success'),
        description: t('profile.passwordUpdateSuccess'),
      });
      return true;
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: t('common.error'),
        description: t('auth.currentPasswordIncorrect'),
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { 
    updateUserProfile, 
    updatePassword, 
    isUpdating 
  };
};
