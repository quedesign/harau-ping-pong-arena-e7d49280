
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface AthleteCardProps {
  athlete: {
    userId: string;
    name: string; // This now requires a string (not undefined)
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
  onClick?: () => void; // Added onClick as an optional prop
}

const AthleteCard: React.FC<AthleteCardProps> = ({ athlete, onClick }) => {
  const { name, level, bio, location } = athlete;
  
  // Format location string if available
  const formattedLocation = location 
    ? [location.city, location.state, location.country].filter(Boolean).join(', ')
    : '';

  return (
    <Card 
      className="hover:bg-accent/10 transition-colors"
      onClick={onClick} // Use the onClick prop if provided
      role={onClick ? "button" : undefined} // Add role for accessibility
      tabIndex={onClick ? 0 : undefined} // Add tabIndex for keyboard navigation
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AthleteCard;
