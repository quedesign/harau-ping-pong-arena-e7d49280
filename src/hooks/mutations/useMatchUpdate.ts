
import { Match } from "@/types";
import { writeData } from "@/integrations/firebase/utils";

export const useMatchUpdate = (setMatches: React.Dispatch<React.SetStateAction<Match[]>>) => {
  const updateMatch = async (id: string, matchData: Partial<Match>): Promise<Match> => {
    const updateData: {
      updated_at: string;
      tournamentId?: string;
      playerOneId?: string;
      playerTwoId?: string;
      scheduledTime?: string;
      status?: 'scheduled' | 'completed' | 'cancelled';
      location?: string;
      winner?: string;
    } = { 
      updated_at: new Date().toISOString(),
    };

    if (matchData.tournamentId) updateData.tournamentId = matchData.tournamentId;
    if (matchData.playerOneId) updateData.playerOneId = matchData.playerOneId;
    if (matchData.playerTwoId) updateData.playerTwoId = matchData.playerTwoId;
    if (matchData.scheduledTime) updateData.scheduledTime = matchData.scheduledTime.toISOString();
    if (matchData.status) updateData.status = matchData.status;
    if (matchData.location !== undefined) updateData.location = matchData.location;
    if (matchData.winner) updateData.winner = matchData.winner;

    await writeData(`matches/${id}`, updateData);

    // Create the updated match object
    const updatedMatch: Match = {
      id,
      tournamentId: updateData.tournamentId || '',
      playerOneId: updateData.playerOneId || '',
      playerTwoId: updateData.playerTwoId || '',
      scores: matchData.scores || { playerOne: [], playerTwo: [] },
      winner: updateData.winner,
      scheduledTime: updateData.scheduledTime ? new Date(updateData.scheduledTime) : new Date(),
      status: updateData.status || 'scheduled',
      location: updateData.location,
    };

    setMatches((prev) => prev.map((m) => (m.id === id ? updatedMatch : m)));
    return updatedMatch;
  };

  return { updateMatch };
};
