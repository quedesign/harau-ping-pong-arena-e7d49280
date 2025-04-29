
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { AthleteProfile } from '@/types';
import { sportsDataSchema, SportsDataFormValues } from './schema';
import BasicInfoFields from './BasicInfoFields';
import PlayingStyleFields from './PlayingStyleFields';
import LocationFields from './LocationFields';

interface SportsDataFormProps {
  profile: AthleteProfile | null;
  onSubmit: (data: SportsDataFormValues) => void;
}

const SportsDataForm: React.FC<SportsDataFormProps> = ({ profile, onSubmit }) => {
  const form = useForm<SportsDataFormValues>({
    resolver: zodResolver(sportsDataSchema),
    defaultValues: {
      handedness: (profile?.handedness || 'right') as 'left' | 'right' | 'ambidextrous',
      level: (profile?.level || 'beginner') as 'beginner' | 'intermediate' | 'advanced' | 'professional',
      playingStyle: profile?.playingStyle,
      gripStyle: profile?.gripStyle,
      playFrequency: profile?.playFrequency,
      tournamentParticipation: profile?.tournamentParticipation,
      club: profile?.club || '',
      availableTimesString: profile?.availableTimes ? profile.availableTimes.join(', ') : '',
      preferredLocationsString: profile?.preferredLocations ? profile.preferredLocations.join(', ') : '',
      yearsPlaying: profile?.yearsPlaying !== undefined ? String(profile.yearsPlaying) : '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        handedness: profile.handedness as 'left' | 'right' | 'ambidextrous',
        level: profile.level as 'beginner' | 'intermediate' | 'advanced' | 'professional',
        playingStyle: profile.playingStyle,
        gripStyle: profile.gripStyle,
        playFrequency: profile.playFrequency,
        tournamentParticipation: profile.tournamentParticipation,
        club: profile.club || '',
        availableTimesString: profile.availableTimes ? profile.availableTimes.join(', ') : '',
        preferredLocationsString: profile.preferredLocations ? profile.preferredLocations.join(', ') : '',
        yearsPlaying: profile.yearsPlaying !== undefined ? String(profile.yearsPlaying) : '',
      });
    }
  }, [profile, form]);

  const handleSubmit = (values: SportsDataFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <BasicInfoFields form={form} />
        <PlayingStyleFields form={form} />
        <LocationFields form={form} />
        <Button type="submit">Salvar alterações</Button>
      </form>
    </Form>
  );
};

export default SportsDataForm;
