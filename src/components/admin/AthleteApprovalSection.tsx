
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Tournament } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Check, X } from 'lucide-react';

interface AthleteApprovalSectionProps {
  tournament: Tournament;
}

const AthleteApprovalSection = ({ tournament }: AthleteApprovalSectionProps) => {
  const { t } = useTranslation();
  const { athleteProfiles, updateTournament } = useData();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // Mock data for athletes registered for this tournament
  // In a real app, this would come from the API
  const registeredAthletes = tournament.registeredParticipants
    .map(id => {
      const profile = athleteProfiles.find(profile => profile.userId === id);
      return {
        id,
        name: `Atleta ${id}`, // Mock name
        level: profile?.level || 'beginner',
        location: profile?.location?.city || 'Unknown',
        status: 'pending' // In a real app, there would be a status field
      };
    });

  const handleApproveAthlete = async (athleteId: string) => {
    setLoading(prev => ({ ...prev, [athleteId]: true }));
    
    try {
      // In a real app, you would update the athlete's status in the database
      // For now, we'll just show a toast
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      toast({
        title: t('admin.athleteApproved'),
        description: t('admin.athleteApprovedSuccess'),
      });
    } catch (error) {
      console.error("Error approving athlete:", error);
      toast({
        title: t('common.error'),
        description: t('admin.approvalError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, [athleteId]: false }));
    }
  };

  const handleRejectAthlete = async (athleteId: string) => {
    setLoading(prev => ({ ...prev, [athleteId]: true }));
    
    try {
      // Remove athlete from tournament participants
      const updatedParticipants = tournament.registeredParticipants.filter(id => id !== athleteId);
      await updateTournament(tournament.id, { 
        registeredParticipants: updatedParticipants 
      });
      
      toast({
        title: t('admin.athleteRejected'),
        description: t('admin.athleteRejectedSuccess'),
      });
    } catch (error) {
      console.error("Error rejecting athlete:", error);
      toast({
        title: t('common.error'),
        description: t('admin.rejectionError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, [athleteId]: false }));
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>{t('admin.athleteApproval')}</CardTitle>
        <CardDescription>
          {t('admin.approveOrRejectAthletes')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {registeredAthletes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.athleteName')}</TableHead>
                <TableHead>{t('admin.level')}</TableHead>
                <TableHead>{t('admin.location')}</TableHead>
                <TableHead className="text-right">{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registeredAthletes.map((athlete) => (
                <TableRow key={athlete.id}>
                  <TableCell className="font-medium">{athlete.name}</TableCell>
                  <TableCell className="capitalize">{athlete.level}</TableCell>
                  <TableCell>{athlete.location}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleApproveAthlete(athlete.id)}
                        disabled={loading[athlete.id]}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {t('admin.approve')}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleRejectAthlete(athlete.id)}
                        disabled={loading[athlete.id]}
                      >
                        <X className="h-4 w-4 mr-1" />
                        {t('admin.reject')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-12 text-center">
            <p className="text-zinc-400">{t('admin.noAthletesToApprove')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AthleteApprovalSection;
