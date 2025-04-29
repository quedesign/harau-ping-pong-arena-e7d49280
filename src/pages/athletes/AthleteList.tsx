// Replace Timer with Clock and BadgeCheck with Award, since they're available in lucide-react
import { Search, MapPin, Filter, Trophy, UserRound, MessageCircle, Users, Award, Clock, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useData } from '@/contexts/data';
import { AthleteProfile } from '@/types';
import { useTranslation } from 'react-i18next';

const AthleteList = () => {
  const { athleteProfiles, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAthletes, setFilteredAthletes] = useState<AthleteProfile[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (athleteProfiles) {
      const filtered = athleteProfiles.filter(athlete =>
        athlete.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.location.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.location.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        athlete.level.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAthletes(filtered);
    }
  }, [searchTerm, athleteProfiles]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{t('athletes.title')}</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder={t('athletes.searchPlaceholder')}
                className="pl-10"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {t('common.filter')}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAthletes.map((athlete) => (
            <div key={athlete.userId} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={`https://avatar.vercel.sh/${athlete.userId}`}
                alt={`${athlete.userId}'s avatar`}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {athlete.location.city}, {athlete.location.state}
                </div>
                <h3 className="text-lg font-semibold mb-2">{athlete.userId}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {t('athletes.level')}: {athlete.level}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-1" />
                    {athlete.wins} {t('athletes.wins')}
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    {athlete.losses} {t('athletes.losses')}
                  </div>
                </div>
                <Link to={`/athlete/${athlete.userId}`} className="block mt-4 text-center text-primary hover:underline">
                  {t('athletes.viewProfile')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AthleteList;

// Dummy Input and Button components (replace with your actual components)
const Input = ({ type, placeholder, className, onChange }: { type: string; placeholder: string; className: string; onChange: (e: any) => void }) => (
  <input type={type} placeholder={placeholder} className={`border rounded-md py-2 px-3 w-full ${className}`} onChange={onChange} />
);

const Button = ({ variant, children }: { variant: string; children: React.ReactNode }) => (
  <button className={`rounded-md py-2 px-4 ${variant === 'outline' ? 'border border-gray-300 text-gray-700' : 'bg-primary text-white'}`}>{children}</button>
);
