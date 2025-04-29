
import * as z from "zod";

// Schema for sports data form
export const sportsDataSchema = z.object({
  handedness: z.enum(["left", "right", "ambidextrous"], {
    required_error: "Por favor, selecione qual mão você usa.",
  }),
  level: z.enum(["beginner", "intermediate", "advanced", "professional"], {
    required_error: "Por favor, selecione seu nível.",
  }),
  // Allow string input that will be converted to number
  height: z.union([
    z.string().transform((val) => val === "" ? undefined : Number(val)),
    z.number().optional()
  ]),
  // Allow string input that will be converted to number
  weight: z.union([
    z.string().transform((val) => val === "" ? undefined : Number(val)),
    z.number().optional()
  ]),
  // Allow string input that will be converted to number
  yearsPlaying: z.union([
    z.string().transform((val) => val === "" ? undefined : Number(val)),
    z.number().optional()
  ]),
  bio: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  playingStyle: z.enum(["offensive", "defensive", "all-round", "other"]).optional(),
  gripStyle: z.enum(["shakehand", "penhold", "seemiller", "other"]).optional(),
  playFrequency: z.enum(["daily", "weekly", "monthly", "rarely"]).optional(),
  tournamentParticipation: z.enum(["never", "local", "regional", "national", "international"]).optional(),
  club: z.string().optional(),
  availableTimesString: z.string().optional(),
  preferredLocationsString: z.string().optional(),
});

export type SportsDataFormValues = z.infer<typeof sportsDataSchema>;
