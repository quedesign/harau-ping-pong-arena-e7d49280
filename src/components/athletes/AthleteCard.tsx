
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageCircle, Eye, MapPin } from 'lucide-react';
import { AthleteProfile } from '@/types';
import { Link } from 'react-router-dom';
import { useState } from 'react';


interface AthleteCardProps {
  athlete: AthleteProfile;
}

export const AthleteCard: React.FC<AthleteCardProps> = ({ athlete }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const handleSendMessage = () => {
    console.log('Send message to', athlete.userId);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    console.log(isFollowing ? 'Unfollow athlete' : 'Follow athlete', athlete.userId);
  };

  const handleViewProfile = () => {
    window.location.href = `/athletes/${athlete.userId}`;
  };
    const name = athlete?.name || `Atleta ${athlete.userId}`;

  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl truncate">{name}</CardTitle>
          {athlete.level && (
            <Badge className="bg-blue-500/20 text-blue-400">
              {athlete.level}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {athlete.bio || 'Sem biografia disponível'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          {athlete.location && (
            <div className="flex items-center text-zinc-400">
               <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">
                {athlete.location.city}, {athlete.location.country}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <Button variant="outline" size="sm" onClick={handleFollow} className="w-24">
           <PlusCircle className="h-4 w-4 mr-2" />
            {isFollowing? "Seguindo" : "Seguir"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleSendMessage} className="w-24">
            <MessageCircle className="h-4 w-4 mr-2" />
            Mensagem
          </Button>
          <Link to={`/athletes/${athlete.userId}`}>
          <Button size="sm" onClick={handleViewProfile} className="w-24">
            <Eye className="h-4 w-4 mr-2" />
            Perfil
          </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AthleteCard;
