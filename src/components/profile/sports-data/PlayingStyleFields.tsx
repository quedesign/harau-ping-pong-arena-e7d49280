
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { SportsDataFormValues } from './schema';

interface PlayingStyleFieldsProps {
  form: UseFormReturn<SportsDataFormValues>;
}

const PlayingStyleFields: React.FC<PlayingStyleFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
};

export default PlayingStyleFields;
