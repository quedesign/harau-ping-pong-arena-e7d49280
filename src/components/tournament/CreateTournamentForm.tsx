
import { TournamentFormat } from "@/types";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Calendar, DollarSign, MapPin, Users, Trophy } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('admin.tournamentName')}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setters.setName(e.target.value)}
              placeholder={t('admin.tournamentNamePlaceholder') as string}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('admin.description')}</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setters.setDescription(e.target.value)}
              placeholder={t('admin.descriptionPlaceholder') as string}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">{t('admin.format')}</Label>
            <RadioGroup
              value={formData.formatType}
              onValueChange={(value) =>
                setters.setFormatType(value as TournamentFormat)
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="knockout" id="knockout" />
                <Label htmlFor="knockout" className="cursor-pointer">
                  <div className="flex items-center">
                    <Trophy size={16} className="mr-2" />
                    {t('admin.knockout')}
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="round-robin" id="round-robin" />
                <Label htmlFor="round-robin" className="cursor-pointer">
                  <div className="flex items-center">
                    <Trophy size={16} className="mr-2" />
                    {t('admin.roundRobin')}
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">{t('admin.startDate')}</Label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
                  size={16}
                />
                <DatePicker
                  id="startDate"
                  mode="single"
                  selected={formData.startDate}
                  onSelect={setters.setStartDate}
                  required
                  placeholder={t('admin.selectDate')}
                  className="w-full pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">{t('admin.endDate')}</Label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
                  size={16}
                />
                <DatePicker
                  id="endDate"
                  mode="single"
                  selected={formData.endDate}
                  onSelect={setters.setEndDate}
                  required
                  placeholder={t('admin.selectDate')}
                  className="w-full pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t('admin.location')}</Label>
            <div className="relative">
              <MapPin
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
                size={16}
              />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setters.setLocation(e.target.value)}
                placeholder={t('admin.locationPlaceholder') as string}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="entryFee">{t('admin.entryFee')}</Label>
            <div className="relative">
              <DollarSign
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
                size={16}
              />
              <Input
                id="entryFee"
                type="number"
                value={formData.entryFee}
                onChange={(e) => setters.setEntryFee(Number(e.target.value))}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxParticipants">{t('admin.maxParticipants')}</Label>
            <div className="relative">
              <Users
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
                size={16}
              />
              <Input
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setters.setMaxParticipants(Number(e.target.value))}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bannerImage">{t('admin.bannerImage')}</Label>
            <Input id="bannerImage" type="file" onChange={(e) => setters.setBannerImage(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pixKey">{t('admin.pixKeyOptional')}</Label>
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
