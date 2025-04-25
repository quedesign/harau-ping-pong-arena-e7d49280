
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, DollarSign, Trophy, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface TournamentDetailsCardProps {
  startDate: Date;
  endDate: Date;
  location: string;
  entryFee: number;
  format: string;
  registeredParticipants: number;
  maxParticipants: number;
  pixKey?: string;
  canRegister: boolean;
  isRegistering: boolean;
  onRegister: () => void;
}

export function TournamentDetailsCard({
  startDate,
  endDate,
  location,
  entryFee,
  format,
  registeredParticipants,
  maxParticipants,
  pixKey,
  canRegister,
  isRegistering,
  onRegister
}: TournamentDetailsCardProps) {
  const { t } = useTranslation();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(t('common.locale', { defaultValue: 'pt-BR' }), {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
      <CardHeader>
        <CardTitle>{t('tournaments.details')}</CardTitle>
        <CardDescription>{t('tournaments.aboutTournament')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 mr-3 mt-0.5 text-zinc-400" />
              <div>
                <p className="font-medium">{t('tournaments.dateTime')}</p>
                <p className="text-zinc-400 text-sm">
                  {formatDate(startDate)} to {formatDate(endDate)}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 mt-0.5 text-zinc-400" />
              <div>
                <p className="font-medium">{t('tournaments.location')}</p>
                <p className="text-zinc-400 text-sm">{location}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <DollarSign className="h-5 w-5 mr-3 mt-0.5 text-zinc-400" />
              <div>
                <p className="font-medium">{t('tournaments.entryFee')}</p>
                <p className="text-zinc-400 text-sm">
                  {entryFee > 0 ? `${entryFee.toLocaleString()} BRL` : t('tournaments.freeEntry')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <Trophy className="h-5 w-5 mr-3 mt-0.5 text-zinc-400" />
              <div>
                <p className="font-medium">{t('tournaments.format')}</p>
                <p className="text-zinc-400 text-sm capitalize">
                  {t(`tournaments.formats.${format}`)}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Users className="h-5 w-5 mr-3 mt-0.5 text-zinc-400" />
              <div>
                <p className="font-medium">{t('tournaments.participants')}</p>
                <p className="text-zinc-400 text-sm">
                  {registeredParticipants} {t('tournaments.registeredOf')} {maxParticipants} {t('tournaments.maximum')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-5 w-5 mr-3 mt-0.5 text-zinc-400" />
              <div>
                <p className="font-medium">{t('tournaments.registrationDeadline')}</p>
                <p className="text-zinc-400 text-sm">
                  {formatDate(new Date(startDate.getTime() - 86400000))}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div>
            <h3 className="font-medium mb-1">{t('tournaments.paymentMethod')}</h3>
            <p className="text-zinc-400 text-sm">
              {pixKey 
                ? t('tournaments.paymentViaPix') 
                : t('tournaments.paymentUponRegistration')}
            </p>
          </div>
          
          {canRegister && (
            <Button 
              disabled={isRegistering}
              onClick={onRegister}
            >
              {isRegistering ? t('common.processing') : t('tournaments.registerNow')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
