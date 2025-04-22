
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { TournamentFormat } from '@/types';
import { TournamentForm } from '@/components/tournament/TournamentForm';
import { PaymentSettings } from '@/components/tournament/PaymentSettings';

const CreateTournament = () => {
  const navigate = useNavigate();
  const { createTournament } = useData();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [format, setFormat] = useState<TournamentFormat>('knockout');
  const [location, setLocation] = useState('');
  const [entryFee, setEntryFee] = useState(0);
  const [maxParticipants, setMaxParticipants] = useState(32);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pixKey, setPixKey] = useState('');

  if (currentUser?.role !== 'admin') {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-zinc-400 mb-6">
            You need admin privileges to create tournaments.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!name || !description || !location || !startDate || !endDate) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      setError('End date cannot be before start date');
      setIsSubmitting(false);
      return;
    }

    try {
      const newTournament = await createTournament({
        name,
        description,
        format,
        location,
        entryFee,
        maxParticipants,
        startDate: start,
        endDate: end,
        registeredParticipants: [],
        createdBy: currentUser.id,
        status: 'upcoming',
        pixKey
      });

      navigate(`/admin/tournaments/${newTournament.id}`);
    } catch (err) {
      setError('Failed to create tournament. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Tournament</h1>
        <p className="text-zinc-400">
          Set up a new table tennis tournament with all the details
        </p>
      </div>

      <TournamentForm
        onSubmit={handleSubmit}
        error={error}
        isSubmitting={isSubmitting}
        formData={{
          name,
          description,
          format,
          location,
          startDate,
          endDate,
          entryFee,
          maxParticipants
        }}
        onFormChange={{
          setName,
          setDescription,
          setFormat,
          setLocation,
          setStartDate,
          setEndDate,
          setEntryFee,
          setMaxParticipants
        }}
        onCancel={() => navigate('/admin/tournaments')}
      />

      <PaymentSettings
        pixKey={pixKey}
        onPixKeyChange={setPixKey}
      />
    </Layout>
  );
};

export default CreateTournament;
