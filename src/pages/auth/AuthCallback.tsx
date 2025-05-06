
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check if we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        setError(sessionError.message);
        return;
      }

      if (session) {
        // Check if user exists in the profiles table
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userError && userError.code !== 'PGRST116') {
          console.error('Error fetching user:', userError);
          setError(userError.message);
          return;
        }
        
        // If user doesn't exist in the profiles table, create a record
        if (!userData) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              name: session.user.user_metadata.name || session.user.user_metadata.full_name || 'User',
              email: session.user.email || '',
              role: 'athlete', // Default role
              profile_image: session.user.user_metadata.avatar_url || ''
            });
            
          if (insertError) {
            console.error('Error creating user record:', insertError);
            setError(insertError.message);
            return;
          }
          
          // Create athlete profile
          const { error: athleteError } = await supabase
            .from('athlete_profiles')
            .insert({
              user_id: session.user.id,
              level: 'beginner',
              handedness: 'right',
              city: 'São Paulo',
              state: 'SP',
              country: 'Brasil',
              wins: 0,
              losses: 0
            });
            
          if (athleteError) {
            console.error('Error creating athlete profile:', athleteError);
            setError(athleteError.message);
            return;
          }
        }
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    };
    
    handleAuthCallback();
  }, [navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        <div className="text-red-500">
          <h2 className="text-xl font-bold mb-2">Error durante autenticação</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded"
          >
            Voltar para login
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-lg">Autenticando...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
