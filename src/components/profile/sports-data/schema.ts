
import { z } from 'zod';

// Schema for the sports data form
export const sportsDataSchema = z.object({
  handedness: z.enum(['left', 'right', 'ambidextrous']),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'professional']),
  playingStyle: z.enum(['offensive', 'defensive', 'all-around']).optional(),
  gripStyle: z.enum(['classic', 'penhold', 'other']).optional(),
  playFrequency: z.enum(['once-a-week', 'twice-or-more', 'weekends-only', 'monthly', 'rarely']).optional(),
  tournamentParticipation: z.enum(['yes', 'no', 'occasionally']).optional(),
  club: z.string().optional(),
  availableTimesString: z.string().optional(),
  preferredLocationsString: z.string().optional(),
  yearsPlaying: z.string().optional().transform(val => val && val.trim() !== '' ? parseInt(val, 10) : undefined)
});

export type SportsDataFormValues = z.infer<typeof sportsDataSchema>;
