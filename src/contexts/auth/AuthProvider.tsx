
import { useEffect, useMemo, useState } from "react";
import { User } from "@/types";
import AuthContext, { AuthContextType } from "./AuthContext";
import { useAuthOperations } from "./useAuthOperations";
import { useLocation, useNavigate } from "react-router-dom";
import { useSessionManagement } from "./hooks/useSessionManagement";
import { useSupabaseAuth } from "./hooks/useSupabaseAuth";
import { useMockLogins } from "./hooks/useMockLogins";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  const {
    login,
    register,
    logout: logoutOperation,
    resetPassword,
    updateUser: updateUserOperation,
    loginWithGoogle,
    currentUser: authCurrentUser,
    setCurrentUser: setAuthCurrentUser,
    isLoading: authIsLoading,
    setIsLoading: setAuthIsLoading,
    error
  } = useAuthOperations();

  // Use our custom hooks
  const { loginWithGithub, loginAsTestUser } = useMockLogins();
  const { refreshSession } = useSessionManagement();
  
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

  // Refresh session when user navigates
  useEffect(() => {
    refreshSession(currentUser);
  }, [pathname, currentUser, refreshSession]);

  const loginWithEmailAndPassword = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Success handling is managed by the auth state change handler
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Ocorreu um erro ao tentar fazer login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmailAndPassword = async (
    name: string,
    email: string,
    password: string,
    role: User["role"]
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        toast({
          title: "Erro ao registrar",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // The profile creation will happen in the onAuthStateChange handler
      toast({
        title: "Registro realizado com sucesso!",
        description: "Sua conta foi criada com sucesso.",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Erro ao registrar",
        description: error.message || "Ocorreu um erro ao tentar registrar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setCurrentUser(null);
      localStorage.removeItem('sessionTimeout');
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar sair",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          email: userData.email,
          profile_image: userData.profileImage
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      setCurrentUser({
        ...currentUser,
        ...userData
      });
      
      toast({
        title: "Perfil atualizado",
        description: "Seu perfil foi atualizado com sucesso",
      });
    } catch (error) {
      console.error("Update user error:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao tentar atualizar seu perfil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPasswordWrapper = async (email: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Email enviado",
        description: "Verifique seu email para redefinir sua senha",
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({
        title: "Erro ao redefinir senha",
        description: error.message || "Ocorreu um erro ao tentar redefinir sua senha",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = useMemo(() => {
    return currentUser?.role === "admin";
  }, [currentUser]);

  const value: AuthContextType = {
    currentUser,
    isLoading,
    isAdmin,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout,
    resetPassword: resetPasswordWrapper,
    updateUser,
    loginWithGoogle,
    loginWithGithub,
    loginAsTestUser,
    error,
    login,
    register,
    setError: useAuthOperations().setError,
    setCurrentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
