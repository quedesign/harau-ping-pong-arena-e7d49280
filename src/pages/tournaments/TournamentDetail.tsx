
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { PaymentQRCode } from '@/components/tournament/PaymentQRCode';
import { TournamentHeader } from '@/components/tournament/TournamentHeader';
import { TournamentRegistration } from '@/components/tournament/TournamentRegistration';
import { TournamentDetailsCard } from '@/components/tournament/TournamentDetailsCard';
import { TournamentOrganizerCard } from '@/components/tournament/TournamentOrganizerCard';
import { TournamentContent } from '@/components/tournament/TournamentContent';

const TournamentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { tournaments, matches, updateTournament } = useData();
  const { currentUser } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const tournament = tournaments.find(t => t.id === id);
  const tournamentMatches = matches.filter(m => m.tournamentId === id);
  
  if (!tournament) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">{t('tournaments.notFound')}</h2>
          <button onClick={() => navigate('/tournaments')}>{t('common.backToTournaments')}</button>
        </div>
      </Layout>
    );
  }

  const isAdmin = currentUser?.role === 'admin' && tournament.createdBy === currentUser.id;
  const isRegistered = tournament.registeredParticipants.includes(currentUser?.id || '');
  const isFull = tournament.registeredParticipants.length >= tournament.maxParticipants;
  const canRegister = tournament.status === 'upcoming' && !isRegistered && !isFull && currentUser?.role === 'athlete';

  const handleRegister = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setIsRegistering(true);
    try {
      await updateTournament(tournament.id, {
        registeredParticipants: [...tournament.registeredParticipants, currentUser.id]
      });
      setRegistrationSuccess(true);
      setTimeout(() => setRegistrationSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to register:', err);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Layout>
      <TournamentHeader 
        name={tournament.name}
        description={tournament.description}
        status={tournament.status}
        isAdmin={isAdmin}
        tournamentId={tournament.id}
      />

      <TournamentRegistration 
        isRegistered={isRegistered}
        isFull={isFull}
        registrationSuccess={registrationSuccess}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <TournamentDetailsCard 
          startDate={tournament.startDate}
          endDate={tournament.endDate}
          location={tournament.location}
          entryFee={tournament.entryFee}
          format={tournament.format}
          registeredParticipants={tournament.registeredParticipants.length}
          maxParticipants={tournament.maxParticipants}
          pixKey={tournament.pixKey}
          canRegister={canRegister}
          isRegistering={isRegistering}
          onRegister={handleRegister}
        />
        
        <TournamentOrganizerCard />

        {tournament.pixKey && (
          <div className="md:col-span-3">
            <PaymentQRCode pixKey={tournament.pixKey} />
          </div>
        )}
      </div>
      
      <TournamentContent 
        status={tournament.status}
        startDate={tournament.startDate}
        tournamentMatches={tournamentMatches}
        registeredParticipants={tournament.registeredParticipants}
      />
    </Layout>
  );
};

export default TournamentDetail;
