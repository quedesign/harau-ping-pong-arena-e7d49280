import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface AthleteProfileHeaderProps {
  athleteName: string;
  bio: string;
  isOwnProfile: boolean;
  userId: string;
  onConnect?: () => void;
}

const AthleteProfileHeader = ({ athleteName, bio, isOwnProfile, userId, onConnect }: AthleteProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4"> 
      <div>
        <h1 className="text-3xl font-bold mb-2">{athleteName}</h1>
        <p className="text-zinc-400">{bio}</p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          Voltar
        </Button>

        {!isOwnProfile && (
          <>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Mensagem
            </Button>
            <Button size="sm" onClick={onConnect}>
              Conectar
            </Button>
          </>
        )}

        {isOwnProfile && (
          <Button size="sm" onClick={() => navigate('/profile')}>
            Editar Perfil
          </Button>
        )}
      </div>
    </div>
  );
};

export default AthleteProfileHeader;