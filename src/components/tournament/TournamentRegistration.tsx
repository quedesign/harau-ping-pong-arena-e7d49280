
import { Check, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface TournamentRegistrationProps {
  isRegistered: boolean;
  isFull: boolean;
  registrationSuccess: boolean;
}

export function TournamentRegistration({
  isRegistered,
  isFull,
  registrationSuccess
}: TournamentRegistrationProps) {
  const { t } = useTranslation();

  if (!isRegistered && !isFull && !registrationSuccess) return null;

  return (
    <>
      {registrationSuccess && (
        <Alert className="mb-6 bg-green-500/10 border-green-500/20 text-green-400">
          <Check className="h-4 w-4" />
          <AlertTitle>{t('tournaments.registrationComplete')}</AlertTitle>
          <AlertDescription>
            {t('tournaments.registrationSuccess')}
          </AlertDescription>
        </Alert>
      )}

      {isRegistered && (
        <Alert className="mb-6 bg-blue-500/10 border-blue-500/20 text-blue-400">
          <Check className="h-4 w-4" />
          <AlertTitle>{t('tournaments.youreRegistered')}</AlertTitle>
          <AlertDescription>
            {t('tournaments.checkSchedule')}
          </AlertDescription>
        </Alert>
      )}

      {isFull && !isRegistered && (
        <Alert className="mb-6 bg-orange-500/10 border-orange-500/20 text-orange-400">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('tournaments.tournamentFull')}</AlertTitle>
          <AlertDescription>
            {t('tournaments.maxCapacityReached')}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
