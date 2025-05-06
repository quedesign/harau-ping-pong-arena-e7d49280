
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Globe, Mail, MessageSquare, User, UserPlus } from 'lucide-react';
import { AthleteProfileHeaderProps } from './types';

const AthleteProfileHeader: React.FC<AthleteProfileHeaderProps> = ({ athlete }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
      <Avatar className="w-24 h-24 border-2 border-primary">
        {athlete.profileImage ? (
          <AvatarImage src={athlete.profileImage} alt={`${athlete.name || 'Athlete'}'s profile`} />
        ) : (
          <AvatarFallback>
            <User className="h-12 w-12" />
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 text-center md:text-left">
        <h1 className="text-2xl font-bold">{athlete.name || `Athlete ${athlete.userId?.substring(0, 8)}`}</h1>
        
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-1 text-sm text-zinc-400">
          <Globe size={14} />
          <span>
            {athlete.location?.city}, {athlete.location?.country}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button size="sm" variant="outline" className="flex gap-2">
          <UserPlus size={16} />
          Follow
        </Button>
        <Button size="sm" variant="outline" className="flex gap-2">
          <MessageSquare size={16} />
          Message
        </Button>
        <Button size="sm" variant="outline" className="flex gap-2">
          <Mail size={16} />
          Email
        </Button>
      </div>
    </div>
  );
};

export default AthleteProfileHeader;
