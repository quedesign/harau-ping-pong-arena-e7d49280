
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
    if (!id) throw new Error("No data returned from create");

    const data = {
      ...matchInsertData,
      id
    }


    const newMatch: Match = {
      id: data.id as string,
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
