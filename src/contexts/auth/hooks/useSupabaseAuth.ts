
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { useNavigate } from 'react-router-dom';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseAuth = (setCurrentUser: (user: User | null) => void) => {
  const navigate = useNavigate();

  // Monitor auth state changes from Supabase
  useEffect(() => {
    // Set up auth state change listener for Google login
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (session && session.user) {
          // Fetch user data from profiles table
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profile }: { data: any }) => {
              if (profile) {
                const user: User = {
                  id: session.user.id,
                  email: session.user.email || '',
                  name: profile.name || session.user.user_metadata?.name || 'Usuário',
                  role: profile.role as UserRole,
                  profileImage: profile.profile_image || '',
                  createdAt: new Date(profile.created_at),
                };
                
                setCurrentUser(user);
                
                // Redirect to dashboard after successful login
                if (event === 'SIGNED_IN') {
                  navigate('/dashboard');
                }
              }
            });
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      }
    );
    
    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (session && session.user) {
        // Fetch user data from profiles table
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }: { data: any }) => {
            if (profile) {
              const user: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: profile.name || session.user.user_metadata?.name || 'Usuário',
                role: profile.role as UserRole,
                profileImage: profile.profile_image || '',
                createdAt: new Date(profile.created_at),
              };
              
              setCurrentUser(user);
            }
          });
      }
    });
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate, setCurrentUser]);
};
