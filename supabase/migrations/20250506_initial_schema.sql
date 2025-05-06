
-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('athlete', 'admin')),
  profile_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create athletes table
CREATE TABLE IF NOT EXISTS public.athletes (
  id UUID REFERENCES public.users(id) PRIMARY KEY,
  handedness TEXT CHECK (handedness IN ('left', 'right', 'ambidextrous')),
  height FLOAT,
  weight FLOAT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'professional')),
  city TEXT,
  state TEXT,
  country TEXT,
  bio TEXT,
  years_playing INTEGER,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  playing_style TEXT CHECK (playing_style IN ('offensive', 'defensive', 'all-round')),
  grip_style TEXT CHECK (grip_style IN ('shakehand', 'penhold', 'seemiller', 'other')),
  play_frequency TEXT CHECK (play_frequency IN ('daily', 'weekly', 'monthly', 'rarely')),
  tournament_participation TEXT CHECK (tournament_participation IN ('never', 'local', 'regional', 'national', 'international')),
  club TEXT,
  racket TEXT,
  rubbers TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create tournaments table
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  format TEXT NOT NULL CHECK (format IN ('knockout', 'round-robin')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  entry_fee FLOAT DEFAULT 0,
  max_participants INTEGER NOT NULL,
  created_by UUID REFERENCES public.users(id),
  banner_image TEXT,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  pix_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create tournament registrations table
CREATE TABLE IF NOT EXISTS public.tournament_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  registration_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'refunded')),
  UNIQUE(tournament_id, athlete_id)
);

-- Create matches table
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE SET NULL,
  player_one_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  player_two_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  winner_id UUID REFERENCES public.athletes(id) ON DELETE SET NULL,
  scheduled_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create match scores table
CREATE TABLE IF NOT EXISTS public.match_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  player_one_scores INTEGER[] NOT NULL,
  player_two_scores INTEGER[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_scores ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
CREATE POLICY "Users can view all users" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Athletes are viewable by everyone" ON public.athletes
  FOR SELECT USING (true);

CREATE POLICY "Athletes can update their own profile" ON public.athletes
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Tournaments are viewable by everyone" ON public.tournaments
  FOR SELECT USING (true);

CREATE POLICY "Admins can create tournaments" ON public.tournaments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update tournaments" ON public.tournaments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create functions for handling available times and preferred locations
CREATE TABLE IF NOT EXISTS public.athlete_available_times (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(athlete_id, day_of_week, start_time, end_time)
);

CREATE TABLE IF NOT EXISTS public.athlete_preferred_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  location_name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(athlete_id, location_name)
);

-- Enable RLS on these tables too
ALTER TABLE public.athlete_available_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athlete_preferred_locations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for these tables
CREATE POLICY "Available times are viewable by everyone" ON public.athlete_available_times
  FOR SELECT USING (true);

CREATE POLICY "Athletes can manage their available times" ON public.athlete_available_times
  FOR ALL USING (athlete_id = auth.uid());

CREATE POLICY "Preferred locations are viewable by everyone" ON public.athlete_preferred_locations
  FOR SELECT USING (true);

CREATE POLICY "Athletes can manage their preferred locations" ON public.athlete_preferred_locations
  FOR ALL USING (athlete_id = auth.uid());
