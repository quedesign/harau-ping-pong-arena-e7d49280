
import { Tournament, TournamentFormat } from '@/types'
import { database } from '@/integrations/firebase/client'
import { set, ref, remove, update } from 'firebase/database'
import { toast } from '@/components/ui/sonner'

export const useTournamentMutations = () => {
  const editTournament = async (
    id: string,
    data: Partial<
      Omit<Tournament, 'id' | 'registeredParticipants' | 'createdBy'>
    >
  ): Promise<void> => {
    const { startDate, endDate, ...rest } = data
    const updateData: any = {
      ...rest,
    }
    if (startDate) updateData.startDate = startDate.toISOString()
    if (endDate) updateData.endDate = endDate.toISOString()
    try {
      await update(ref(database, `tournaments/${id}`), updateData)
      toast.success('Tournament updated successfully!')
    } catch (error) {
      console.error('Error updating tournament:', error)
      toast.error('Error updating tournament')
    }
  }
  const deleteTournament = async (id: string): Promise<void> => {
    try {
      await remove(ref(database, `tournaments/${id}`))
      toast.success('Tournament deleted successfully!')
    } catch (error) {
      console.error('Error deleting tournament:', error)
      toast.error('Error deleting tournament')
    }
  }
  const registerParticipant = async (
    tournamentId: string,
    userId: string
  ): Promise<void> => {
    try {
      await set(
        ref(database, `tournaments/${tournamentId}/registeredParticipants/${userId}`),
        true
      )
      toast.success('Registered successfully!')
    } catch (error) {
      console.error('Error registering participant:', error)
      toast.error('Error registering participant')
    }
  }
  const unregisterParticipant = async (
    tournamentId: string,
    userId: string
  ): Promise<void> => {
    try {
      await remove(
        ref(
          database,
          `tournaments/${tournamentId}/registeredParticipants/${userId}`
        )
      )
      toast.success('Unregistered successfully!')
    } catch (error) {
      console.error('Error unregistering participant:', error)
      toast.error('Error unregistering participant')
    }
  }
  const changeTournamentStatus = async (
    tournamentId: string,
    status: 'upcoming' | 'in-progress' | 'completed'
  ): Promise<void> => {
    try {
      await update(ref(database, `tournaments/${tournamentId}`), {
        status,
      })
      toast.success(`Tournament status updated to ${status}!`)
    } catch (error) {
      console.error('Error updating tournament status:', error)
      toast.error('Error updating tournament status')
    }
  }

  return {
    editTournament,
    deleteTournament,
    registerParticipant,
    unregisterParticipant,
    changeTournamentStatus,
  }
}
