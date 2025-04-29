
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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

interface EquipmentTabProps {
  equipment?: {
    racket?: string;
    rubbers?: string;
  };
  onUpdate: (equipment: { racket?: string; rubbers?: string }) => void;
}

const equipmentSchema = z.object({
  racket: z.string().optional(),
  rubbers: z.string().optional(),
});

type EquipmentFormValues = z.infer<typeof equipmentSchema>;

const EquipmentTab = ({ equipment, onUpdate }: EquipmentTabProps) => {
  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      racket: equipment?.racket || '',
      rubbers: equipment?.rubbers || '',
    },
  });

  useEffect(() => {
    if (equipment) {
      form.reset({
        racket: equipment.racket || '',
        rubbers: equipment.rubbers || '',
      });
    }
  }, [equipment, form]);

  const onSubmit = (values: EquipmentFormValues) => {
    onUpdate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipamentos</CardTitle>
        <CardDescription>
          Cadastre os equipamentos que você utiliza
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="racket"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raquete (modelo/marca)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Ex: Butterfly Viscaria" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rubbers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Borrachas (marca/tipo)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Ex: Forehand: Tenergy 05, Backhand: Dignics 09C" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Salvar equipamentos</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EquipmentTab;
