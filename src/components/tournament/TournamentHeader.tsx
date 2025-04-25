
import { Share2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TournamentHeaderProps {
  name: string;
  description: string;
  status: string;
  isAdmin: boolean;
  tournamentId: string;
}

export function TournamentHeader({ 
  name, 
  description, 
  status, 
  isAdmin,
  tournamentId
}: TournamentHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">{name}</h1>
          <Badge className={`
            ${status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' : ''}
            ${status === 'ongoing' ? 'bg-green-500/20 text-green-400' : ''}
            ${status === 'completed' ? 'bg-zinc-500/20 text-zinc-400' : ''}
          `}>
            {t(`tournaments.status.${status}`)}
          </Badge>
        </div>
        <p className="text-zinc-400">{description}</p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => window.history.back()}>
          {t('common.back')}
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          {t('common.share')}
        </Button>
        {isAdmin && (
          <Button 
            size="sm"
            onClick={() => navigate(`/admin/tournaments/${tournamentId}/manage`)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {t('admin.manageTournament')}
          </Button>
        )}
      </div>
    </div>
  );
}
