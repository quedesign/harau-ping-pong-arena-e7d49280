
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTournamentMutations } from '@/hooks/useTournamentMutations';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { cn } from '@/lib/utils';
import { addDays, format } from 'date-fns';
import { toast } from '@/components/ui/sonner';
import { TournamentFormat } from '@/types';

const CreateTournament = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createTournament } = useTournamentMutations();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formatType, setFormatType] = useState<TournamentFormat>('knockout');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState('');
  const [entryFee, setEntryFee] = useState(0);
  const [maxParticipants, setMaxParticipants] = useState(32);
  const [bannerImage, setBannerImage] = useState('');
  const [pixKey, setPixKey] = useState('');

  if (!currentUser || currentUser.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  const handleSetFormat = (value: string) => {
    setFormatType(value as TournamentFormat);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !formatType || !startDate || !endDate || !location || !entryFee || !maxParticipants) {
      toast.error(t('admin.allFieldsRequired'));
      return;
    }

    const newTournament = {
      name,
      description,
      format: formatType,
      startDate,
      endDate,
      location,
      entryFee,
      maxParticipants,
      registeredParticipants: [],
      createdBy: currentUser.id,
      bannerImage,
      status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed',
      pixKey,
    };

    try {
      await createTournament(newTournament);
      toast.success(t('admin.tournamentCreated'));
      navigate('/tournaments');
    } catch (error) {
      console.error('Error creating tournament:', error);
      toast.error(t('common.errorCreating'));
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>{t('admin.createTournament')}</CardTitle>
            <CardDescription>
              {t('admin.fillInTheDetails')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('admin.tournamentName')}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('admin.description')}</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">{t('admin.format')}</Label>
                <Select value={formatType} onValueChange={handleSetFormat}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('admin.selectFormat')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="knockout">{t('admin.knockout')}</SelectItem>
                    <SelectItem value="round-robin">{t('admin.roundRobin')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">{t('admin.startDate')}</Label>
                  <DatePicker
                    id="startDate"
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    required
                    placeholder={t('admin.selectDate')}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">{t('admin.endDate')}</Label>
                  <DatePicker
                    id="endDate"
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    required
                    placeholder={t('admin.selectDate')}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">{t('admin.location')}</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entryFee">{t('admin.entryFee')}</Label>
                <Input
                  id="entryFee"
                  type="number"
                  value={entryFee}
                  onChange={(e) => setEntryFee(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">{t('admin.maxParticipants')}</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(Number(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bannerImage">{t('admin.bannerImageURL')}</Label>
                <Input
                  id="bannerImage"
                  type="url"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pixKey">{t('admin.pixKey')}</Label>
                <Input
                  id="pixKey"
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                />
              </div>
              <Button type="submit">{t('admin.createTournament')}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateTournament;
