import { Match } from "@/types";

export const fetchMatches = async (): Promise<Match[]> => {
  try {
    // Simulate fetching matches from an API
    const response = await new Promise<Match[]>((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "1",
            tournamentId: "1",
            athlete1Id: "1",
            athlete2Id: "2",
            score1: 2,
            score2: 1,
          },
          {
            id: "2",
            tournamentId: "1",
            athlete1Id: "3",
            athlete2Id: "4",
            score1: 0,
            score2: 2,
          },
        ]);
      }, 1000);
    });

    return response;
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
};