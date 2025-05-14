
import { useState, useEffect } from 'react';
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function useSupabaseSession() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up Supabase auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session?.user?.id);
      setIsLoading(true);

      if (session?.user) {
        try {
          // Fetch user profile from profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error fetching user profile:", profileError);
          }
          
          if (profile) {
            const userData: User = {
              id: profile.id,
              name: profile.name || 'User',
              email: profile.email || session.user.email || '',
              role: (profile.role as User["role"]) || 'athlete',
              profileImage: profile.profile_image || undefined,
              createdAt: profile.created_at ? new Date(profile.created_at) : new Date(),
            };
            setCurrentUser(userData);
          } else if (session.user.id) {
            // If profile doesn't exist, create one
            const newProfile = {
              id: session.user.id,
              name: session.user.user_metadata?.name || 'User', 
              email: session.user.email || '',
              role: (session.user.user_metadata?.role as User["role"]) || 'athlete',
              profile_image: session.user.user_metadata?.avatar_url || null,
            };
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert(newProfile);
              
            if (insertError) {
              console.error("Error creating user profile:", insertError);
            } else {
              // Use the new profile data
              setCurrentUser({
                id: session.user.id,
                name: newProfile.name,
                email: newProfile.email,
                role: newProfile.role,
                profileImage: newProfile.profile_image || undefined,
                createdAt: new Date(),
              });
            }
          }
        } catch (err) {
          console.error("Error processing user data:", err);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      
      setIsLoading(false);
    });

    // Initial auth state check
    const checkInitialAuthState = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsLoading(false);
        }
        // The onAuthStateChange handler will set the user if session exists
      } catch (error) {
        console.error("Error checking initial auth state:", error);
        setIsLoading(false);
      }
    };

    checkInitialAuthState();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    currentUser,
    setCurrentUser,
    isLoading,
    setIsLoading
  };
}
