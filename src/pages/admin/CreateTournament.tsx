import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Calendar, DollarSign, MapPin, Users, Trophy } from 'lucide-react';
import { TournamentFormat } from '@/types';

const CreateTournament = () => {
  const navigate = useNavigate();
  const { createTournament } = useData();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixKey, setPixKey] = useState('');

  if (currentUser?.role !== 'admin') {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-zinc-400 mb-6">
            You need admin privileges to create tournaments.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!name || !description || !location || !startDate || !endDate) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      setError('End date cannot be before start date');
      setIsSubmitting(false);
      return;
    }

    try {
      const newTournament = await createTournament({
        name,
        description,
        format,
        location,
        entryFee,
        maxParticipants,
        startDate: start,
        endDate: end,
        registeredParticipants: [],
        createdBy: currentUser.id,
        status: 'upcoming',
        pixKey
      });

      navigate(`/admin/tournaments/${newTournament.id}`);
    } catch (err) {
      setError('Failed to create tournament. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Tournament</h1>
        <p className="text-zinc-400">
          Set up a new table tennis tournament with all the details
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 mb-8">
        <CardHeader>
          <CardTitle>Tournament Information</CardTitle>
          <CardDescription>
            Enter the basic details about your tournament
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                onClick={() => navigate('/admin/tournaments')}
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

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Configurações de Pagamento</CardTitle>
          <CardDescription>
            Configure como os participantes irão pagar pela inscrição
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Método de Pagamento</Label>
              <div className="mt-2 p-4 bg-black rounded-md border border-zinc-800">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-md bg-green-500/10 text-green-400 flex items-center justify-center mr-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                      <path d="M9.5 13.8L14.5 8.8M7.3 11.6L8.8 13.1L7.3 11.6ZM11.6 15.9L13.1 17.4L11.6 15.9ZM8.8 15.9L7.3 17.4L8.8 15.9ZM13.1 11.6L11.6 13.1L13.1 11.6ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Pagamento via PIX</h3>
                    <p className="text-sm text-zinc-400">
                      Participantes irão pagar via PIX após o registro
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pixKey">Chave PIX*</Label>
              <Input
                id="pixKey"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="CPF, e-mail, telefone ou chave aleatória"
                className="bg-black border-zinc-800"
                required
              />
              <p className="text-sm text-zinc-400">
                Insira sua chave PIX para receber os pagamentos das inscrições
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">
                Nota: Quando um participante se registrar, receberá as instruções de pagamento por e-mail. 
                O acesso ao torneio será liberado após a confirmação do pagamento.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default CreateTournament;
