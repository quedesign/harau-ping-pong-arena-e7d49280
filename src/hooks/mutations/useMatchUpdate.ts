
import { Match } from "@/types";
import { writeData } from "@/integrations/firebase/utils";

export const useMatchUpdate = (setMatches: React.Dispatch<React.SetStateAction<Match[]>>) => {
  const updateMatch = async (id: string, matchData: Partial<Match>): Promise<Match> => {
    const updateData: {
      updated_at: string;
      tournament_id?: string;
      player_one_id?: string;
      player_two_id?: string;
      scheduled_time?: string;
      status?: 'scheduled' | 'completed' | 'cancelled';
      location?: string;
    } = { 
      updated_at: new Date().toISOString(),
    };

    if (matchData.tournamentId) updateData.tournament_id = matchData.tournamentId;
    if (matchData.playerOneId) updateData.player_one_id = matchData.playerOneId;
    if (matchData.playerTwoId) updateData.player_two_id = matchData.playerTwoId;
    if (matchData.scheduledTime) updateData.scheduled_time = matchData.scheduledTime.toISOString();
    if (matchData.status) updateData.status = matchData.status;
    if (matchData.location !== undefined) updateData.location = matchData.location;

    if (Object.keys(updateData).length > 1) {
      await writeData(`matches/${id}`, updateData);
    }

    const matchDataFromFirebase = await writeData(`matches/${id}`, {});
    if (!matchDataFromFirebase) throw new Error("No match data found");

    const updatedMatch: Match = {
      id: id,
      tournamentId: matchDataFromFirebase.tournament_id,
      playerOneId: matchDataFromFirebase.player_one_id,
      playerTwoId: matchDataFromFirebase.player_two_id,
      scores: {
        playerOne: [],
        playerTwo: [],
      },
      winner: matchData.winner,
      scheduledTime: new Date(matchDataFromFirebase.scheduled_time),
      status: matchDataFromFirebase.status,
      location: matchDataFromFirebase.location,
    };

    if (updatedMatch.status === 'completed' && !updatedMatch.winner) {
      // You can implement the logic here if you want to auto calculate the winner
    }

    setMatches((prev) => prev.map((m) => (m.id === id ? updatedMatch : m)));
    return updatedMatch;
  };

  return { updateMatch };
};
