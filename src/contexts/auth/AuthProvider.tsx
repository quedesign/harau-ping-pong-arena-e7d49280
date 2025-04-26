
import React, { createContext, useContext, useEffect } from 'react';
import { AuthContextType } from './types';
import { useAuthOperations } from './useAuthOperations';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentUser,
    setCurrentUser,
    isLoading,
    setIsLoading,
    error,
    setSession,
    login,
    logout,
    register,
    createTestUser,
    resetPassword,
  } = useAuthOperations();

  useEffect(() => {
    console.log("Setting up auth listener...");
    // Primeiro configurar o listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setSession(session);
      
      if (session?.user) {
        // Buscar perfil do usuário
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error: profileError }) => {
            if (profileError) {
              console.error('Error fetching profile:', profileError);
              setIsLoading(false);
              return;
            }
            
            if (profile) {
              console.log("Profile found:", profile);
              setCurrentUser({
                id: session.user.id,
                name: profile.name,
                email: profile.email,
                role: profile.role as UserRole,
                profileImage: profile.profile_image,
                createdAt: new Date(session.user.created_at)
              });
            } else {
              console.log("No profile found for user");
            }
            setIsLoading(false);
          });
      } else {
        setCurrentUser(null);
        setIsLoading(false);
      }
    });

    // Depois, verificar a sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Getting current session:", session?.user?.id);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error: profileError }) => {
            if (profileError) {
              console.error('Error fetching profile:', profileError);
              setIsLoading(false);
              return;
            }
            
            if (profile) {
              console.log("Profile loaded from session:", profile);
              setCurrentUser({
                id: session.user.id,
                name: profile.name,
                email: profile.email,
                role: profile.role as UserRole,
                profileImage: profile.profile_image,
                createdAt: new Date(session.user.created_at)
              });
            }
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    currentUser,
    isLoading,
    error,
    login,
    logout,
    register,
    createTestUser,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
