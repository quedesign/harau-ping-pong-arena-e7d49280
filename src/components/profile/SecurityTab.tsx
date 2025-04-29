
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface SecurityTabProps {
  onPasswordChange: (currentPassword: string, newPassword: string) => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ onPasswordChange }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  // Schema for form validation
  const passwordSchema = z.object({
    currentPassword: z.string().min(1, t('common.required')),
    newPassword: z.string().min(6, t('auth.passwordLengthError')),
    confirmPassword: z.string().min(6, t('auth.passwordLengthError'))
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: t('auth.passwordsDoNotMatch'),
    path: ['confirmPassword'],
  });

  // Form setup
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
  });

  // Submit handler
  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    try {
      await onPasswordChange(values.currentPassword, values.newPassword);
      form.reset(); // Reset form on success
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Shield className="mr-2 h-5 w-5" />
          {t('profile.security')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profile.currentPassword')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field} 
                      className="border-zinc-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profile.newPassword')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field} 
                      className="border-zinc-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profile.confirmPassword')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field} 
                      className="border-zinc-700"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t('common.saving') : t('common.save')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SecurityTab;
