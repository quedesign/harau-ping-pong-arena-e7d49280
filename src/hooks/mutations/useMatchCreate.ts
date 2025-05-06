
import { Match } from "@/types";
import { writeData } from "@/integrations/firebase/utils";

export const useMatchCreate = (
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>
) => {
  const createMatch = async (
    matchData: Omit<Match, "id">
  ): Promise<Match> => {
    const { scheduledTime, ...rest } = matchData;

    const matchInsertData = {
      tournamentId: rest.tournamentId,
      playerOneId: rest.playerOneId,
      playerTwoId: rest.playerTwoId,
      scheduledTime: scheduledTime.toISOString(),
      status: rest.status,
      location: rest.location,
    };

    const id = await writeData("matches", matchInsertData);
    const generatedId = typeof id === 'string' ? id : Date.now().toString();

    const data = {
      ...matchInsertData,
      id: generatedId
    }

    const newMatch: Match = {
      id: data.id,
      tournamentId: data.tournamentId,
      playerOneId: data.playerOneId,
      playerTwoId: data.playerTwoId,
      scores: { playerOne: [], playerTwo: [] },
      winner: rest.winner,
      scheduledTime: new Date(data.scheduledTime),
      status: data.status as "scheduled" | "completed" | "cancelled",
      location: data.location,
    };

    setMatches((prev) => [...prev, newMatch]);
    return newMatch;
  };

  return { createMatch };
};
