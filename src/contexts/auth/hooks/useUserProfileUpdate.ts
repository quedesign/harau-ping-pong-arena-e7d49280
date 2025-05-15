
import { useState } from 'react';
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function useUserProfileUpdate() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateUserProfile = async (userData: Partial<User>, currentUser: User | null) => {
    if (!currentUser?.id) return null;
    setIsUpdating(true);
    
    try {
      // Handle case where profileImage is undefined 
      const profileImage = userData.profileImage === undefined 
        ? currentUser.profileImage 
        : userData.profileImage;
        
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name || currentUser.name,
          email: userData.email || currentUser.email,
          profile_image: profileImage
        })
        .eq('id', currentUser.id || '');

      if (error) throw error;
      
      toast({
        title: "Perfil atualizado",
        description: "Seu perfil foi atualizado com sucesso",
      });
      
      return {
        ...currentUser,
        ...userData
      };
    } catch (error) {
      console.error("Update user error:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao tentar atualizar seu perfil",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateUserProfile,
    isUpdating
  };
}
