
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, MessageSquare, UserPlus, UserMinus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth';

interface AthleteCardProps {
  athlete: {
    userId: string;
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
    bio?: string;
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
    wins?: number;
    losses?: number;
  };
  onClick?: () => void;
  onFollowClick?: () => void;
  onMessageClick?: () => void;
}

const AthleteCard: React.FC<AthleteCardProps> = ({ 
  athlete, 
  onClick, 
  onFollowClick,
  onMessageClick
}) => {
  const { name, level, bio, location } = athlete;
  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Format location string if available
  const formattedLocation = location 
    ? [location.city, location.state, location.country].filter(Boolean).join(', ')
    : '';

  const isCurrentUser = currentUser?.id === athlete.userId;

  const handleFollowClick = () => {
    if (isCurrentUser) return;
    setIsFollowing(!isFollowing);
    if (onFollowClick) onFollowClick();
  };

  return (
    <Card 
      className="hover:bg-accent/10 transition-colors"
      role={onClick ? "button" : undefined} 
      tabIndex={onClick ? 0 : undefined}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} />
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{name}</h3>
              <Badge variant="outline" className="text-xs capitalize">{level}</Badge>
            </div>
            
            {bio && <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{bio}</p>}
            
            {formattedLocation && (
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{formattedLocation}</span>
              </div>
            )}
            
            <div className="flex mt-3 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8"
                disabled={isCurrentUser}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollowClick();
                }}
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="h-3 w-3 mr-1" />
                    Remover
                  </>
                ) : (
                  <>
                    <UserPlus className="h-3 w-3 mr-1" />
                    Seguir
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8"
                disabled={isCurrentUser}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onMessageClick) onMessageClick();
                }}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Mensagem
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onClick) onClick();
                }}
              >
                <User className="h-3 w-3 mr-1" />
                Perfil
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AthleteCard;
