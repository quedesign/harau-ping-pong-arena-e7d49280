
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { SportsDataFormValues } from './schema';

interface LocationFieldsProps {
  form: UseFormReturn<SportsDataFormValues>;
}

const LocationFields: React.FC<LocationFieldsProps> = ({ form }) => {
  return (
    <>
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

      <FormField
        control={form.control}
        name="availableTimesString"
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
        name="preferredLocationsString"
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
    </>
  );
};

export default LocationFields;
