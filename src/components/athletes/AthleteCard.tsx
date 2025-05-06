
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageCircle, Eye, MapPin } from 'lucide-react';
import { AthleteProfile } from '@/types';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export interface AthleteCardProps {
  athlete: AthleteProfile;
  onClick?: () => void;
}

export const AthleteCard: React.FC<AthleteCardProps> = ({ athlete, onClick }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const handleSendMessage = () => {
    console.log('Send message to', athlete.userId);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    console.log(isFollowing ? 'Unfollow athlete' : 'Follow athlete', athlete.userId);
  };

  const handleViewProfile = () => {
    if (onClick) {
      onClick();
    } else {
      window.location.href = `/athletes/${athlete.userId}`;
    }
  };
  
  const name = athlete?.name || `Atleta ${athlete.userId}`;

  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardHeader className="pb-1 px-4 pt-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg truncate">{name}</CardTitle>
          {athlete.level && (
            <Badge className="bg-blue-500/20 text-blue-400">
              {athlete.level}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2 text-xs">
          {athlete.bio || 'Sem biografia disponível'}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-3">
        <div className="mb-2">
          {athlete.location && (
            <div className="flex items-center text-zinc-400">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="text-xs">
                {athlete.location.city}, {athlete.location.country}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-1 mt-3">
          <Button variant="outline" size="sm" onClick={handleFollow} className="h-8 px-2 text-xs">
            <PlusCircle className="h-3 w-3 mr-1" />
            {isFollowing? "Seguindo" : "Seguir"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleSendMessage} className="h-8 px-2 text-xs">
            <MessageCircle className="h-3 w-3 mr-1" />
            Mensagem
          </Button>
          {onClick ? (
            <Button size="sm" onClick={handleViewProfile} className="h-8 px-2 text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Perfil
            </Button>
          ) : (
            <Link to={`/athletes/${athlete.userId}`}>
              <Button size="sm" className="h-8 px-2 text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Perfil
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AthleteCard;
