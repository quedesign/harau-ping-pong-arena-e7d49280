
import { useTranslation } from 'react-i18next';
import { Tournament } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TournamentHeaderProps {
  tournament: Tournament;
  onStartTournament: () => void;
  onBackToSetup: () => void;
}

const TournamentHeader = ({ tournament, onStartTournament, onBackToSetup }: TournamentHeaderProps) => {
  const { t } = useTranslation();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <Link to="/tournaments">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('common.back')}
          </Button>
        </Link>
        <Badge className={`
          ${tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' : ''}
          ${tournament.status === 'ongoing' ? 'bg-green-500/20 text-green-400' : ''}
          ${tournament.status === 'completed' ? 'bg-zinc-500/20 text-zinc-400' : ''}
        `}>
          {t(`tournaments.status.${tournament.status}`)}
        </Badge>
      </div>

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{tournament.name}</h1>
          <p className="text-zinc-400">
            {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
            <span className="mx-2">•</span>
            {tournament.registeredParticipants.length}/{tournament.maxParticipants} {t('tournaments.participants')}
          </p>
        </div>

        <div className="flex gap-2">
          {tournament.status === 'upcoming' && (
            <Button onClick={onStartTournament}>
              <Play className="h-4 w-4 mr-2" />
              {t('admin.startTournament')}
            </Button>
          )}
          {tournament.status === 'ongoing' && (
            <Button variant="outline" onClick={onBackToSetup}>
              <Clock className="h-4 w-4 mr-2" />
              {t('admin.backToSetup')}
            </Button>
          )}
          <Link to={`/tournaments/${tournament.id}`}>
            <Button variant="outline">
              {t('admin.viewPublicPage')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TournamentHeader;
