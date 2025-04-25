
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function TournamentOrganizerCard() {
  const { t } = useTranslation();

  return (
    <Card className="bg-zinc-900 border-zinc-800 h-fit">
      <CardHeader>
        <CardTitle>{t('tournaments.organizer')}</CardTitle>
        <CardDescription>{t('tournaments.tournamentAdministration')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mr-4">
            <span className="text-lg font-semibold">A</span>
          </div>
          <div>
            <p className="font-medium">{t('admin.adminUser')}</p>
            <p className="text-zinc-400 text-sm">{t('tournaments.tournamentDirector')}</p>
          </div>
        </div>
        
        <Button variant="outline" className="w-full">
          {t('tournaments.contactOrganizer')}
        </Button>
      </CardContent>
    </Card>
  );
}
