import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTournament } from '@/contexts/data';
import { useAuth } from '@/contexts/auth';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';
import AthleteApprovalSection from '@/components/admin/AthleteApprovalSection';
import { TournamentFormat, Tournament } from '@/types';

const ManageTournament = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { tournaments, loading, updateTournament, deleteTournament } = useTournament();
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formatType, setFormatType] = useState<TournamentFormat>('knockout');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState('');
  const [entryFee, setEntryFee] = useState(0);
  const [maxParticipants, setMaxParticipants] = useState(0);
  const [bannerImage, setBannerImage] = useState('');
  const [status, setStatus] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');
  const [pixKey, setPixKey] = useState('');

  useEffect(() => {
    if (tournaments && id) {
      const foundTournament = tournaments.find(t => t.id === id);
      if (foundTournament) {
        setTournament(foundTournament);
      } else {
        setError(new Error('Tournament not found'));
      }
    }
  }, [tournaments, id]);

  useEffect(() => {
    if (tournament) {
      setName(tournament.name);
      setDescription(tournament.description);
      setFormatType(tournament.format);
      setStartDate(tournament.startDate);
      setEndDate(tournament.endDate);
      setLocation(tournament.location);
      setEntryFee(tournament.entryFee);
      setMaxParticipants(tournament.maxParticipants);
      setBannerImage(tournament.bannerImage || '');
      setStatus(tournament.status);
      setPixKey(tournament.pixKey || '');
    }
  }, [tournament]);

  const handleSetFormat = (value: string) => {
    setFormatType(value as TournamentFormat);
  };
  
  const handleSetStatus = (value: string) => {
    setStatus(value as 'upcoming' | 'ongoing' | 'completed');
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">You do not have permission to view this page.</h2>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Error: {error.message}</h2>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const updatedTournamentData = {
      name,
      description,
      format: formatType,
      startDate: startDate || new Date(),
      endDate: endDate || new Date(),
      location,
      entryFee,
      maxParticipants,
      bannerImage,
      status,
      pixKey,
    };

    await updateTournament(id, updatedTournamentData);
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteTournament(id);
    navigate('/admin/tournaments');
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Manage Tournament</CardTitle>
            <CardDescription>Edit tournament details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="format">Format</Label>
                  <Select value={formatType} onValueChange={(value) => setFormatType(value as TournamentFormat)}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-400">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-400">
                      <SelectItem value="knockout">Knockout</SelectItem>
                      <SelectItem value="round-robin">Round Robin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Start Date</Label>
                  <DatePicker
                    date={startDate}
                    onSelect={setStartDate}
                    selected={startDate}
                    mode="single"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>End Date</Label>
                  <DatePicker
                    date={endDate}
                    onSelect={setEndDate}
                    selected={endDate}
                    mode="single"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="entryFee">Entry Fee</Label>
                  <Input
                    id="entryFee"
                    type="number"
                    value={entryFee}
                    onChange={(e) => setEntryFee(Number(e.target.value))}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div>
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(Number(e.target.value))}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bannerImage">Banner Image URL</Label>
                  <Input
                    id="bannerImage"
                    type="text"
                    value={bannerImage}
                    onChange={(e) => setBannerImage(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as 'upcoming' | 'ongoing' | 'completed')}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-400">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-400">
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="pixKey">PIX Key</Label>
                <Input
                  id="pixKey"
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <Button type="submit">Update Tournament</Button>
            </form>
          </CardContent>
        </Card>

        {tournament && <AthleteApprovalSection tournament={tournament} />}

        <Button variant="destructive" onClick={handleDelete}>
          Delete Tournament
        </Button>
      </div>
    </Layout>
  );
};

export default ManageTournament;
