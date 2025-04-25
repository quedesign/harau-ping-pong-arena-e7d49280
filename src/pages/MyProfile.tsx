
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { Shield, UserCog, Key } from 'lucide-react';

const MyProfile = () => {
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Table tennis specific fields
  const [skills, setSkills] = useState({
    handedness: 'right',
    level: 'beginner',
    yearsPlaying: '0',
    playingStyle: '',
  });

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === currentUser.id);

    if (userIndex >= 0) {
      users[userIndex] = {
        ...users[userIndex],
        name,
        email,
        skills
      };

      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('harauAuth', JSON.stringify({ ...currentUser, name, email }));

      toast({
        title: t('common.success'),
        description: 'Perfil atualizado com sucesso',
      });
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: t('common.error'),
        description: 'As senhas não coincidem',
        variant: 'destructive',
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === currentUser.id);

    if (userIndex >= 0 && users[userIndex].password === currentPassword) {
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      toast({
        title: t('common.success'),
        description: 'Senha atualizada com sucesso',
      });
    } else {
      toast({
        title: t('common.error'),
        description: 'Senha atual incorreta',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <UserCog className="h-4 w-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="security">
              <Key className="h-4 w-4 mr-2" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="skills">
              <Shield className="h-4 w-4 mr-2" />
              Habilidades
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais aqui.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit">Salvar Alterações</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>
                  Atualize sua senha de acesso aqui.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit">Alterar Senha</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Habilidades no Tênis de Mesa</CardTitle>
                <CardDescription>
                  Atualize suas informações de jogo aqui.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="handedness">Mão Dominante</Label>
                    <select
                      id="handedness"
                      className="w-full p-2 border rounded-md"
                      value={skills.handedness}
                      onChange={(e) => setSkills({ ...skills, handedness: e.target.value })}
                    >
                      <option value="right">Destro</option>
                      <option value="left">Canhoto</option>
                      <option value="ambidextrous">Ambidestro</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Nível</Label>
                    <select
                      id="level"
                      className="w-full p-2 border rounded-md"
                      value={skills.level}
                      onChange={(e) => setSkills({ ...skills, level: e.target.value })}
                    >
                      <option value="beginner">Iniciante</option>
                      <option value="intermediate">Intermediário</option>
                      <option value="advanced">Avançado</option>
                      <option value="professional">Profissional</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsPlaying">Anos de Experiência</Label>
                    <Input
                      id="yearsPlaying"
                      type="number"
                      value={skills.yearsPlaying}
                      onChange={(e) => setSkills({ ...skills, yearsPlaying: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="playingStyle">Estilo de Jogo</Label>
                    <Input
                      id="playingStyle"
                      value={skills.playingStyle}
                      onChange={(e) => setSkills({ ...skills, playingStyle: e.target.value })}
                      placeholder="Ex: Ofensivo, Defensivo, All-around"
                    />
                  </div>
                  <Button type="submit">Salvar Habilidades</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyProfile;
