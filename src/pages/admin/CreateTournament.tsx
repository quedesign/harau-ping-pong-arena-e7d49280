
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useCreateTournament } from '@/hooks/useCreateTournament';
import Layout from '@/components/layout/Layout';
import { CreateTournamentForm } from '@/components/tournament/CreateTournamentForm';

const CreateTournament = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const {
    formData,
    setters,
    handleSubmit,
  } = useCreateTournament();

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
