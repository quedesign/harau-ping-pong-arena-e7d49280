
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth';
import Layout from '@/components/layout/Layout'
import { useAthlete } from '@/contexts/data/athlete';
import AthleteProfileHeader from '@/components/athlete/AthleteProfileHeader';
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { AthleteProfile as AthleteProfileType, Tournament } from '@/types';
import AthleteMatches from '@/components/athlete/AthleteMatches'
import { useMatchFetch } from '@/hooks/useMatchFetch';
import AthleteStats, { AthleteStatsData } from '@/components/athlete/AthleteStats';
import AthleteTournaments from '@/components/athlete/AthleteTournaments';
import AthleteProfileCard from '@/components/athlete/AthleteProfileCard';
import AthleteMatchRequest from '@/components/athlete/AthleteMatchRequest';
