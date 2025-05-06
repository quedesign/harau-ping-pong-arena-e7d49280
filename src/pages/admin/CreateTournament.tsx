
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useCreateTournament } from '@/hooks/useCreateTournament';
import Layout from '@/components/layout/Layout';
import { CreateTournamentForm } from '@/components/tournament/CreateTournamentForm';
import { toast } from 'sonner';
import { useTournament } from '@/contexts/data';
import { Tournament } from '@/types';

const CreateTournament = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createTournament } = useTournament();

  const {
    formData,
    setters,
  } = useCreateTournament();

  const handleSubmit = async () => {
    try {
      if (!currentUser) {
        toast.error("Você precisa estar logado para criar um torneio");
        return;
      }

      // Validate required fields
      if (!formData.startDate || !formData.endDate) {
        toast.error("Datas de início e fim são obrigatórias");
        return;
      }
      
      const tournamentData: Omit<Tournament, 'id'> = {
        name: formData.name,
        description: formData.description,
        format: formData.formatType, // Changed from format to formatType
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        entryFee: formData.entryFee,
        maxParticipants: formData.maxParticipants,
        registeredParticipants: [],
        createdBy: currentUser.id || '',
        bannerImage: formData.bannerImage || '',
        status: 'upcoming',
        pixKey: formData.pixKey || '',
      };
      
      const newTournament = await createTournament(tournamentData);
      
      toast.success("Torneio criado com sucesso!");
      navigate(`/admin/tournaments/${newTournament.id}/manage`);
    } catch (error) {
      console.error("Error creating tournament:", error);
      toast.error("Erro ao criar torneio");
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  return (
    <Layout>
      <div className="container max-w-4xl py-6">
        <CreateTournamentForm
          formData={formData}
          setters={setters}
          onSubmit={handleSubmit}
        />
      </div>
    </Layout>
  );
};

export default CreateTournament;
