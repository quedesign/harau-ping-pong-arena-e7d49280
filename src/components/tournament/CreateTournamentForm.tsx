
import { TournamentFormat } from '@/types';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface CreateTournamentFormProps {
  formData: {
    name: string;
    description: string;
    formatType: TournamentFormat;
    startDate?: Date;
    endDate?: Date;
    location: string;
    entryFee: number;
    maxParticipants: number;
    bannerImage: string;
    pixKey: string;
  };
  setters: {
    setName: (value: string) => void;
    setDescription: (value: string) => void;
    setFormatType: (value: TournamentFormat) => void;
    setStartDate: (value: Date | undefined) => void;
    setEndDate: (value: Date | undefined) => void;
    setLocation: (value: string) => void;
    setEntryFee: (value: number) => void;
    setMaxParticipants: (value: number) => void;
    setBannerImage: (value: string) => void;
    setPixKey: (value: string) => void;
  };
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const CreateTournamentForm = ({
  formData,
  setters,
  onSubmit
}: CreateTournamentFormProps) => {
  const { t } = useTranslation();

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>{t('admin.createTournament')}</CardTitle>
        <CardDescription>
          {t('admin.fillInTheDetails')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('admin.tournamentName')}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setters.setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t('admin.description')}</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setters.setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">{t('admin.format')}</Label>
            <Select 
              value={formData.formatType} 
              onValueChange={(value) => setters.setFormatType(value as TournamentFormat)}
            >
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
                selected={formData.startDate}
                onSelect={setters.setStartDate}
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
                selected={formData.endDate}
                onSelect={setters.setEndDate}
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
              value={formData.location}
              onChange={(e) => setters.setLocation(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entryFee">{t('admin.entryFee')}</Label>
            <Input
              id="entryFee"
              type="number"
              value={formData.entryFee}
              onChange={(e) => setters.setEntryFee(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxParticipants">{t('admin.maxParticipants')}</Label>
            <Input
              id="maxParticipants"
              type="number"
              value={formData.maxParticipants}
              onChange={(e) => setters.setMaxParticipants(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bannerImage">{t('admin.bannerImageURL')}</Label>
            <Input
              id="bannerImage"
              type="url"
              value={formData.bannerImage}
              onChange={(e) => setters.setBannerImage(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pixKey">{t('admin.pixKey')}</Label>
            <Input
              id="pixKey"
              type="text"
              value={formData.pixKey}
              onChange={(e) => setters.setPixKey(e.target.value)}
            />
          </div>

          <Button type="submit">{t('admin.createTournament')}</Button>
        </form>
      </CardContent>
    </Card>
  );
};
