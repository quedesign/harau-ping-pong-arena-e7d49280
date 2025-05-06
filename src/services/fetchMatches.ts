
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
            playerOneId: "1",
            playerTwoId: "2",
            scores: {
              playerOne: [2],
              playerTwo: [1]
            },
            scheduledTime: new Date(),
            status: "completed"
          },
          {
            id: "2",
            tournamentId: "1",
            playerOneId: "3",
            playerTwoId: "4",
            scores: {
              playerOne: [0],
              playerTwo: [2]
            },
            scheduledTime: new Date(),
            status: "completed"
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
