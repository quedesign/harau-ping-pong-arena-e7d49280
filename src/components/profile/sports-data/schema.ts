
import { z } from 'zod';

// Schema para o formulário de dados esportivos
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
  yearsPlaying: z.string()
    .optional()
    // Transforma string para número se não estiver vazio
    .transform(val => {
      if (val && val.trim() !== '') {
        const num = parseInt(val, 10);
        return isNaN(num) ? undefined : num;
      }
      return undefined;
    })
});

export type SportsDataFormValues = z.infer<typeof sportsDataSchema>;
