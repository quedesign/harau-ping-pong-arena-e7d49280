
import { Tournament, TournamentFormat } from '@/types';
import { writeData, deleteData } from '@/integrations/firebase/utils';


export const useTournamentMutations = (setTournaments: React.Dispatch<React.SetStateAction<Tournament[]>>) => {
  const createTournament = async (tournamentData: Omit<Tournament, 'id'>): Promise<Tournament> => {
    const { startDate, endDate, ...rest } = tournamentData;

    const id = crypto.randomUUID()
    
    const firebaseTournament = {
      name: rest.name,
      description: rest.description,
      format: rest.format,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      location: rest.location,
      entry_fee: rest.entryFee,
      max_participants: rest.maxParticipants,
      created_by: rest.createdBy,
      status: rest.status,
      banner_image: rest.bannerImage,
      pix_key: rest.pixKey,
      id: id
    };

    await writeData(`tournaments/${id}`, firebaseTournament)

    
    const newTournament: Tournament = {
      id: firebaseTournament.id,
      name: firebaseTournament.name,
      description: firebaseTournament.description,
      format: firebaseTournament.format as TournamentFormat,
      startDate: new Date(firebaseTournament.start_date),
      endDate: new Date(firebaseTournament.end_date),
      location: firebaseTournament.location,
      entryFee: Number(firebaseTournament.entry_fee),
      maxParticipants: firebaseTournament.max_participants,
      registeredParticipants: [],
      createdBy: firebaseTournament.created_by,
      bannerImage: firebaseTournament.banner_image,
      status: firebaseTournament.status as 'upcoming' | 'ongoing' | 'completed',
      pixKey: firebaseTournament.pix_key
    };
    
    setTournaments(prev => [...prev, newTournament]);
    return newTournament;
  };

  const updateTournament = async (id: string, data: Partial<Tournament>): Promise<Tournament> => {
    const updateData: Partial<Tournament> = {
      name: data.name,
      description: data.description,
      format: data.format,
      startDate: data.startDate,
      endDate: data.endDate,
      location: data.location,
      entryFee: data.entryFee,
      maxParticipants: data.maxParticipants,
      bannerImage: data.bannerImage,
      status: data.status,
      pixKey: data.pixKey,
    };

    
    
    if (data.name) updateData.name = data.name;
    if (data.description) updateData.description = data.description;
    if (data.format) updateData.format = data.format;
    if (data.startDate) updateData.start_date = data.startDate.toISOString();
    if (data.endDate) updateData.end_date = data.endDate.toISOString();
    if (data.location) updateData.location = data.location;
    if (data.entryFee !== undefined) updateData.entry_fee = data.entryFee;
    if (data.maxParticipants) updateData.max_participants = data.maxParticipants;
    if (data.bannerImage !== undefined) updateData.banner_image = data.bannerImage;
    if (data.status) updateData.status = data.status;
    if (data.pixKey !== undefined) updateData.pix_key = data.pixKey;
    updateData.updated_at = new Date().toISOString();

    await writeData(`tournaments/${id}`, updateData)
    
    const updatedTournament: Tournament = {
      id: id,
      name: updateData.name || '',
      description: updateData.description || '',
      format: updateData.format || 'single-elimination',
      startDate: updateData.startDate || new Date(),
      endDate: updateData.endDate || new Date(),
      location: updateData.location || '',
      entryFee: updateData.entryFee || 0,
      maxParticipants: updateData.maxParticipants || 0,
      registeredParticipants: [],
      createdBy: '', //TODO: fix this
      bannerImage: updateData.bannerImage || undefined,
      status: updateData.status || 'upcoming',
      pixKey: updateData.pixKey || undefined
    };

    setTournaments((prev) =>
      prev.map((t) => (t.id === id ? updatedTournament : t))
    );
    return updatedTournament;
  };

  const deleteTournament = async (id: string): Promise<void> => {
    await deleteData(`tournaments/${id}`)
    setTournaments(prev => prev.filter(t => t.id !== id));
  };

  return {
    createTournament,
    updateTournament,
    deleteTournament
  };
};
