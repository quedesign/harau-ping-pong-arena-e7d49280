
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
    console.log("Configurando listener de autenticação...");
    setIsLoading(true);
    
    // Primeiro configurar o listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Estado de autenticação alterado:", event, session?.user?.id);
      setSession(session);
      
      if (session?.user) {
        // Buscar perfil do usuário de forma assíncrona
        setTimeout(() => {
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user!.id)
            .maybeSingle()
            .then(({ data: profile, error: profileError }) => {
              if (profileError) {
                console.error('Erro ao buscar perfil:', profileError);
                setIsLoading(false);
                return;
              }
              
              if (profile) {
                console.log("Perfil encontrado:", profile);
                setCurrentUser({
                  id: session.user!.id,
                  name: profile.name,
                  email: profile.email,
                  role: profile.role as UserRole,
                  profileImage: profile.profile_image,
                  createdAt: new Date(session.user.created_at)
                });
              } else {
                console.log("Nenhum perfil encontrado para o usuário, verificando dados do auth");
                // Tenta criar um perfil baseado nos metadados do usuário
                const userData = session.user.user_metadata;
                if (userData && userData.name) {
                  const newProfile = {
                    id: session.user.id,
                    name: userData.name,
                    email: session.user.email,
                    role: (userData.role || 'athlete') as UserRole,
                    profileImage: null,
                  };
                  
                  // Criar perfil se necessário
                  supabase
                    .from('profiles')
                    .insert([{
                      id: session.user.id,
                      name: newProfile.name,
                      email: newProfile.email,
                      role: newProfile.role
                    }])
                    .then(({ error: insertError }) => {
                      if (insertError) {
                        console.error("Erro ao criar perfil:", insertError);
                      } else {
                        console.log("Perfil criado com sucesso");
                        setCurrentUser({
                          ...newProfile,
                          createdAt: new Date(session.user!.created_at)
                        });
                      }
                      setIsLoading(false);
                    });
                } else {
                  console.log("Dados insuficientes para criar perfil");
                  setCurrentUser(null);
                  setIsLoading(false);
                }
              }
              setIsLoading(false);
            });
        }, 0);
      } else {
        setCurrentUser(null);
        setIsLoading(false);
      }
    });

    // Depois, verificar a sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Obtendo sessão atual:", session?.user?.id);
      if (session?.user) {
        setTimeout(() => {
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user!.id)
            .maybeSingle()
            .then(({ data: profile, error: profileError }) => {
              if (profileError) {
                console.error('Erro ao buscar perfil:', profileError);
                setIsLoading(false);
                return;
              }
              
              if (profile) {
                console.log("Perfil carregado da sessão:", profile);
                setCurrentUser({
                  id: session.user!.id,
                  name: profile.name,
                  email: profile.email,
                  role: profile.role as UserRole,
                  profileImage: profile.profile_image,
                  createdAt: new Date(session.user.created_at)
                });
              } else {
                console.log("Nenhum perfil encontrado na sessão atual");
              }
              setIsLoading(false);
            });
        }, 0);
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
