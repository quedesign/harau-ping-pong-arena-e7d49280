
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { User } from '@/types';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';

interface ProfileTabProps {
  currentUser: User;
  onUpdate?: (user: User) => void;
}

const ProfileTab = ({ currentUser }: ProfileTabProps) => {
  const { t } = useTranslation();
  const { setCurrentUser } = useAuth() as any;
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [isLoading, setIsLoading] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Update user profile on supabase
      setCurrentUser({...currentUser, name, email} as User);
      toast.success('Perfil atualizado com sucesso!');
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar perfil';
      toast.error('Erro', {
        description: message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.personalInfo')}</CardTitle>
        <CardDescription>
          {t('profile.updatePersonalInfo')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="profile-image">{t('profile.profilePicture')}</Label>
            <div className="flex items-center space-x-4 py-2">
              <Avatar className="h-20 w-20">
                <AvatarImage 
                  src={currentUser.profileImage || undefined} 
                  alt={currentUser.name} 
                />
                <AvatarFallback className="text-lg">
                  {getInitials(currentUser.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button type="button" variant="outline" disabled className="mr-2">
                  {t('profile.uploadNew')}
                </Button>
                <Button type="button" variant="ghost" disabled>
                  {t('profile.remove')}
                </Button>
                <p className="text-sm text-zinc-400 mt-2">
                  {t('profile.imageRecommendation')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t('profile.name')}</Label>
              <Input
                id="name"
                placeholder={t('profile.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('profile.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('profile.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">{t('profile.role')}</Label>
              <Input
                id="role"
                value={currentUser.role === 'admin' ? t('profile.admin') : t('profile.athlete')}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-since">{t('profile.memberSince')}</Label>
              <Input
                id="member-since"
                value={currentUser.createdAt.toLocaleDateString()}
                disabled
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('common.saving') : t('common.saveChanges')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
