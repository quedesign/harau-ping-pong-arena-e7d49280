
import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Match } from '@/types';

interface MatchItemProps {
  match: Match;
}

export function TournamentMatchItem({ match }: MatchItemProps) {
  const { t } = useTranslation();
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(t('common.locale', { defaultValue: 'pt-BR' }), {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const playerOneName = t('tournaments.player', { number: 1 });
  const playerTwoName = t('tournaments.player', { number: 2 });

  return (
    <div className="p-4 bg-black rounded-md border border-zinc-800">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-zinc-400">
          {formatDate(match.scheduledTime)}
        </div>
        <Badge className={`
          ${match.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' : ''}
          ${match.status === 'completed' ? 'bg-green-500/20 text-green-400' : ''}
          ${match.status === 'cancelled' ? 'bg-red-500/20 text-red-400' : ''}
        `}>
          {t(`tournaments.matchStatus.${match.status}`)}
        </Badge>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
            {playerOneName.charAt(0)}
          </div>
          <span className={match.winner === match.playerOneId ? 'font-bold' : ''}>
            {playerOneName}
          </span>
        </div>
        
        <div className="text-center">
          <div className="font-medium">
            {match.status === 'completed' ? (
              <span>
                {match.scores.playerOne.join('-')} : {match.scores.playerTwo.join('-')}
              </span>
            ) : (
              <span>vs</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={match.winner === match.playerTwoId ? 'font-bold' : ''}>
            {playerTwoName}
          </span>
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
            {playerTwoName.charAt(0)}
          </div>
        </div>
      </div>
      
      {match.location && (
        <div className="mt-2 text-sm text-zinc-400 flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          {match.location}
        </div>
      )}
    </div>
  );
}
