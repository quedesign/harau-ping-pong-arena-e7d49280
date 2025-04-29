
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AthleteProfile } from '@/types';

interface SportsDataTabProps {
  profile: AthleteProfile | null;
  onUpdate: (data: Partial<AthleteProfile>) => void;
}

const sportsDataSchema = z.object({
  handedness: z.enum(['left', 'right', 'ambidextrous']),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'professional']),
  playingStyle: z.enum(['offensive', 'defensive', 'all-around']).optional(),
  gripStyle: z.enum(['classic', 'penhold', 'other']).optional(),
  playFrequency: z.enum(['once-a-week', 'twice-or-more', 'weekends-only', 'monthly', 'rarely']).optional(),
  tournamentParticipation: z.enum(['yes', 'no', 'occasionally']).optional(),
  club: z.string().optional(),
  availableTimes: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()) : undefined),
  preferredLocations: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()) : undefined),
  yearsPlaying: z.string().optional().transform(val => val ? Number(val) : undefined)
});

type SportsDataFormValues = z.infer<typeof sportsDataSchema>;

const SportsDataTab = ({ profile, onUpdate }: SportsDataTabProps) => {
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
      availableTimes: profile?.availableTimes?.join(', ') || '',
      preferredLocations: profile?.preferredLocations?.join(', ') || '',
      yearsPlaying: profile?.yearsPlaying?.toString() || '',
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
        availableTimes: profile.availableTimes?.join(', ') || '',
        preferredLocations: profile.preferredLocations?.join(', ') || '',
        yearsPlaying: profile.yearsPlaying?.toString() || '',
      });
    }
  }, [profile, form]);

  const onSubmit = (values: SportsDataFormValues) => {
    onUpdate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados Esportivos</CardTitle>
        <CardDescription>
          Atualize suas informações esportivas para encontrar parceiros de jogo compatíveis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="handedness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mão dominante</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="right">Destro</SelectItem>
                        <SelectItem value="left">Canhoto</SelectItem>
                        <SelectItem value="ambidextrous">Ambidestro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de habilidade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Iniciante</SelectItem>
                        <SelectItem value="intermediate">Intermediário</SelectItem>
                        <SelectItem value="advanced">Avançado</SelectItem>
                        <SelectItem value="professional">Competidor federado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="playingStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estilo de jogo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="offensive">Ofensivo</SelectItem>
                        <SelectItem value="defensive">Defensivo</SelectItem>
                        <SelectItem value="all-around">All-around</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gripStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de empunhadura</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="classic">Clássica</SelectItem>
                        <SelectItem value="penhold">Caneta</SelectItem>
                        <SelectItem value="other">Outras</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="playFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequência de jogo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="once-a-week">1x por semana</SelectItem>
                        <SelectItem value="twice-or-more">2x ou mais por semana</SelectItem>
                        <SelectItem value="weekends-only">Somente fins de semana</SelectItem>
                        <SelectItem value="monthly">Mensalmente</SelectItem>
                        <SelectItem value="rarely">Raramente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tournamentParticipation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participa de torneios?</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Sim</SelectItem>
                        <SelectItem value="no">Não</SelectItem>
                        <SelectItem value="occasionally">Ocasionalmente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearsPlaying"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anos de experiência</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        placeholder="Ex: 2" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="club"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Associação ou clube que frequenta</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Nome do clube ou associação (opcional)" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="availableTimes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horários disponíveis para jogar</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Ex: Segunda 19h, Quarta 20h, Sábados à tarde (separados por vírgula)" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredLocations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Locais onde costuma jogar</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Locais onde costuma jogar (separados por vírgula)" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Salvar alterações</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SportsDataTab;
