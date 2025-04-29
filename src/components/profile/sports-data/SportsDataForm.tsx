
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
      height: profile?.height,
      weight: profile?.weight,
      yearsPlaying: profile?.yearsPlaying,
      bio: profile?.bio || '',
      city: profile?.location?.city || '',
      state: profile?.location?.state || '',
      country: profile?.location?.country || '',
      playingStyle: profile?.playingStyle ? mapPlayingStyle(profile.playingStyle) : undefined,
      gripStyle: profile?.gripStyle ? mapGripStyle(profile.gripStyle) : undefined,
      playFrequency: profile?.playFrequency ? mapPlayFrequency(profile.playFrequency) : undefined,
      tournamentParticipation: profile?.tournamentParticipation,
      club: profile?.club || '',
      availableTimesString: profile?.availableTimes ? profile.availableTimes.join(', ') : '',
      preferredLocationsString: profile?.preferredLocations ? profile.preferredLocations.join(', ') : '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        handedness: profile.handedness as 'left' | 'right' | 'ambidextrous',
        level: profile.level as 'beginner' | 'intermediate' | 'advanced' | 'professional',
        height: profile.height,
        weight: profile.weight,
        yearsPlaying: profile.yearsPlaying,
        bio: profile.bio || '',
        city: profile.location?.city || '',
        state: profile.location?.state || '',
        country: profile.location?.country || '',
        playingStyle: profile.playingStyle ? mapPlayingStyle(profile.playingStyle) : undefined,
        gripStyle: profile.gripStyle ? mapGripStyle(profile.gripStyle) : undefined,
        playFrequency: profile.playFrequency ? mapPlayFrequency(profile.playFrequency) : undefined,
        tournamentParticipation: profile.tournamentParticipation,
        club: profile.club || '',
        availableTimesString: profile.availableTimes ? profile.availableTimes.join(', ') : '',
        preferredLocationsString: profile.preferredLocations ? profile.preferredLocations.join(', ') : '',
      });
    }
  }, [profile, form]);

  const handleSubmit = (values: SportsDataFormValues) => {
    onSubmit(values);
  };

  // Helper functions to map between types
  function mapPlayingStyle(style: string): "offensive" | "defensive" | "all-round" | "other" {
    if (style === "all-around") return "all-round";
    if (style === "offensive" || style === "defensive") return style as any;
    return "other";
  }

  function mapGripStyle(style: string): "shakehand" | "penhold" | "seemiller" | "other" {
    if (style === "classic") return "shakehand";
    if (style === "penhold" || style === "seemiller") return style as any;
    return "other";
  }

  function mapPlayFrequency(freq: string): "daily" | "weekly" | "monthly" | "rarely" {
    if (freq === "once-a-week") return "weekly";
    if (freq === "twice-or-more") return "daily";
    if (freq === "monthly") return "monthly";
    return "rarely";
  }

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
