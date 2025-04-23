
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Check, Dices, Star, Trophy, ArrowRight, Flag, FilePen
} from 'lucide-react';

// Componentes para cada fase de gerenciamento
import TournamentHeader from '@/components/admin/TournamentHeader';
import AthleteApprovalSection from '@/components/admin/AthleteApprovalSection';
import SeedingSection from '@/components/admin/SeedingSection';
import BracketManagement from '@/components/admin/BracketManagement';
import ResultsEntry from '@/components/admin/ResultsEntry';
import TournamentFinalization from '@/components/admin/TournamentFinalization';

const ManageTournament = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { tournaments, updateTournament } = useData();
  const { currentUser } = useAuth();
  const [tournament, setTournament] = useState(tournaments.find(t => t.id === id));
  const [activeTab, setActiveTab] = useState('athletes');

  // Verificar se o usuário é administrador e criador do torneio
  useEffect(() => {
    if (!tournament) {
      navigate('/tournaments');
      return;
    }

    if (!currentUser || currentUser.role !== 'admin' || tournament.createdBy !== currentUser.id) {
      toast({
        title: t('common.unauthorized'),
        description: t('tournaments.notAdmin'),
        variant: 'destructive'
      });
      navigate(`/tournaments/${id}`);
    }
  }, [currentUser, tournament, id, navigate, toast, t]);

  // Atualiza o torneio quando há mudanças
  useEffect(() => {
    const updatedTournament = tournaments.find(t => t.id === id);
    if (updatedTournament) {
      setTournament(updatedTournament);
    }
  }, [tournaments, id]);

  // Navega de volta se o torneio não existir mais
  if (!tournament) {
    return null;
  }

  // Determinar qual aba deve estar ativa com base no status do torneio
  const getActiveTab = () => {
    if (tournament.status === 'completed') return 'finalize';
    if (tournament.status === 'ongoing') return 'results';
    return activeTab;
  };

  const updateStatus = async (newStatus: 'upcoming' | 'ongoing' | 'completed') => {
    try {
      await updateTournament(tournament.id, { status: newStatus });
      toast({
        title: t('tournaments.statusUpdated'),
        description: t(`tournaments.statusTo${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`),
      });
    } catch (error) {
      console.error("Error updating tournament status:", error);
      toast({
        title: t('common.error'),
        description: t('tournaments.statusUpdateError'),
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <TournamentHeader 
        tournament={tournament} 
        onStartTournament={() => updateStatus('ongoing')} 
        onBackToSetup={() => updateStatus('upcoming')}
      />

      <Tabs 
        defaultValue={getActiveTab()} 
        value={getActiveTab()} 
        onValueChange={setActiveTab}
        className="mt-6"
      >
        <TabsList className="bg-zinc-900 border-zinc-800 grid grid-cols-5 w-full">
          <TabsTrigger value="athletes" disabled={tournament.status === 'completed'}>
            <Check className="mr-2" size={16} />
            {t('admin.approveAthletes')}
          </TabsTrigger>
          <TabsTrigger value="seeding" disabled={tournament.status === 'completed'}>
            <Star className="mr-2" size={16} />
            {t('admin.seeding')}
          </TabsTrigger>
          <TabsTrigger value="bracket" disabled={tournament.status === 'completed'}>
            <Dices className="mr-2" size={16} />
            {t('admin.drawBracket')}
          </TabsTrigger>
          <TabsTrigger value="results" disabled={tournament.status !== 'ongoing'}>
            <FilePen className="mr-2" size={16} />
            {t('admin.enterResults')}
          </TabsTrigger>
          <TabsTrigger value="finalize">
            <Flag className="mr-2" size={16} />
            {t('admin.finalizeTournament')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="athletes" className="mt-4">
          <AthleteApprovalSection tournament={tournament} />
        </TabsContent>
        
        <TabsContent value="seeding" className="mt-4">
          <SeedingSection tournament={tournament} />
        </TabsContent>
        
        <TabsContent value="bracket" className="mt-4">
          <BracketManagement tournament={tournament} />
        </TabsContent>
        
        <TabsContent value="results" className="mt-4">
          <ResultsEntry tournament={tournament} />
        </TabsContent>
        
        <TabsContent value="finalize" className="mt-4">
          <TournamentFinalization 
            tournament={tournament} 
            onFinalize={() => updateStatus('completed')} 
          />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default ManageTournament;
