
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, DollarSign, MapPin, Users, Trophy, Loader2 } from "lucide-react";
import { TournamentFormat } from "@/types";

interface TournamentFormProps {
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
  isSubmitting: boolean;
  formData: {
    name: string;
    description: string;
    format: TournamentFormat;
    location: string;
    startDate: string;
    endDate: string;
    entryFee: number;
    maxParticipants: number;
  };
  onFormChange: {
    setName: (value: string) => void;
    setDescription: (value: string) => void;
    setFormat: (value: TournamentFormat) => void;
    setLocation: (value: string) => void;
    setStartDate: (value: string) => void;
    setEndDate: (value: string) => void;
    setEntryFee: (value: number) => void;
    setMaxParticipants: (value: number) => void;
  };
  onCancel: () => void;
}

export function TournamentForm({ 
  onSubmit, 
  error, 
  isSubmitting, 
  formData, 
  onFormChange,
  onCancel
}: TournamentFormProps) {
  const { 
    name, description, format, location, 
    startDate, endDate, entryFee, maxParticipants 
  } = formData;

  const {
    setName, setDescription, setFormat, setLocation,
    setStartDate, setEndDate, setEntryFee, setMaxParticipants
  } = onFormChange;

  return (
    <Card className="bg-zinc-900 border-zinc-800 mb-8">
      <CardHeader>
        <CardTitle>Tournament Information</CardTitle>
        <CardDescription>
          Enter the basic details about your tournament
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Tournament Name*</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., São Paulo Summer Championship"
                className="bg-black border-zinc-800"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description*</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about your tournament..."
                className="bg-black border-zinc-800 min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tournament Format*</Label>
                <RadioGroup 
                  value={format}
                  onValueChange={(value) => setFormat(value as TournamentFormat)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="knockout" id="knockout" />
                    <Label htmlFor="knockout" className="cursor-pointer">
                      <div className="flex items-center">
                        <Trophy size={16} className="mr-2" />
                        Knockout (Elimination)
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="round-robin" id="round-robin" />
                    <Label htmlFor="round-robin" className="cursor-pointer">
                      <div className="flex items-center">
                        <Trophy size={16} className="mr-2" />
                        Round Robin (Group Play)
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location*</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={16} />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Venue address"
                    className="bg-black border-zinc-800 pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date*</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={16} />
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-black border-zinc-800 pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date*</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={16} />
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-black border-zinc-800 pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entryFee">Entry Fee (BRL)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={16} />
                  <Input
                    id="entryFee"
                    type="number"
                    min="0"
                    value={entryFee}
                    onChange={(e) => setEntryFee(Number(e.target.value))}
                    placeholder="0 for free entry"
                    className="bg-black border-zinc-800 pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={16} />
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="2"
                    max="128"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(Number(e.target.value))}
                    className="bg-black border-zinc-800 pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : 'Create Tournament'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
