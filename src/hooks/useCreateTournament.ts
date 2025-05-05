
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth'; // Import useAuth
import { TournamentFormat } from '@/types';
import { toast } from '@/components/ui/sonner';
import { useTranslation } from 'react-i18next';
import { database } from '@/integrations/firebase/client';
import { set, push, ref } from 'firebase/database';

export const useCreateTournament = () => {
  const { t } = useTranslation()
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Get currentUser from useAuth

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [formatType, setFormatType] = useState<TournamentFormat>('knockout')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [location, setLocation] = useState('')
  const [entryFee, setEntryFee] = useState(0)
  const [maxParticipants, setMaxParticipants] = useState(32)
  const [bannerImage, setBannerImage] = useState('')
  const [pixKey, setPixKey] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic required fields check
    if (!name || !description || !startDate || !endDate || !location) {
      toast.error(t('admin.allFieldsRequired'))
      return
    }

    // Check if end date is after start date
    if (endDate <= startDate) {
      toast.error(t('admin.endDateMustBeAfterStartDate'))
      return
    }

    // Check if entry fee is non-negative
    if (entryFee < 0) {
      toast.error(t('admin.entryFeeMustBeNonNegative'))
      return
    }

    // Check if max participants is valid
    if (maxParticipants < 2 || maxParticipants > 128) {
      toast.error(t('admin.maxParticipantsOutOfRange'))
      return
    }

    // Check if format type is valid
    if (!['knockout', 'round-robin'].includes(formatType)) {
      toast.error(t('admin.invalidFormatType'))
      return
    }

    try {
      const newTournamentRef = push(ref(database, 'tournaments'));
      const newTournament = {
        name,
        description,
        format: formatType,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        location,
        entryFee,
        maxParticipants,
        createdBy: currentUser?.id || '', // Now currentUser is available
      bannerImage,
        status: 'upcoming' as const,
        pixKey,
        registeredParticipants: {}
      };
      await set(newTournamentRef, newTournament);
      toast.success(t('admin.tournamentCreated'))
      navigate('/admin/manage-tournament')
    } catch (error) {
      console.error('Error creating tournament:', error)
      toast.error(t('common.errorCreating'))
    }
  }

  return {
    formData: {
      name, description, formatType, startDate, endDate, location, entryFee, maxParticipants, bannerImage, pixKey
    },
    setters: {
      setName, setDescription, setFormatType, setStartDate, setEndDate, setLocation, setEntryFee, setMaxParticipants, setBannerImage, setPixKey
    },
    handleSubmit,
  };
};
