
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useTournamentMutations } from '@/hooks/useTournamentMutations';
import { TournamentFormat } from '@/types';
import { toast } from '@/components/ui/sonner';
import { useTranslation } from 'react-i18next';

export const useCreateTournament = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createTournament } = useTournamentMutations(undefined);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formatType, setFormatType] = useState<TournamentFormat>('knockout');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState('');
  const [entryFee, setEntryFee] = useState(0);
  const [maxParticipants, setMaxParticipants] = useState(32);
  const [bannerImage, setBannerImage] = useState('');
  const [pixKey, setPixKey] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !formatType || !startDate || !endDate || !location || !entryFee || !maxParticipants) {
      toast.error(t('admin.allFieldsRequired'));
      return;
    }

    const newTournament = {
      name,
      description,
      format: formatType,
      startDate,
      endDate,
      location,
      entryFee,
      maxParticipants,
      registeredParticipants: [],
      createdBy: currentUser?.id || '',
      bannerImage,
      status: 'upcoming' as const,
      pixKey,
    };

    try {
      await createTournament(newTournament);
      toast.success(t('admin.tournamentCreated'));
      navigate('/tournaments');
    } catch (error) {
      console.error('Error creating tournament:', error);
      toast.error(t('common.errorCreating'));
    }
  };

  return {
    formData: {
      name,
      description,
      formatType,
      startDate,
      endDate,
      location,
      entryFee,
      maxParticipants,
      bannerImage,
      pixKey,
    },
    setters: {
      setName,
      setDescription,
      setFormatType,
      setStartDate,
      setEndDate,
      setLocation,
      setEntryFee,
      setMaxParticipants,
      setBannerImage,
      setPixKey,
    },
    handleSubmit,
    currentUser
  };
};
