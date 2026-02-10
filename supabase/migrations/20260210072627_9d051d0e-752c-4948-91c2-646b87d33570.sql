
-- Create argument_scores table for authenticated users
CREATE TABLE public.argument_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('critique', 'coach', 'autopsy')),
  input_preview TEXT NOT NULL,
  total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
  clarity_score INTEGER NOT NULL CHECK (clarity_score >= 0 AND clarity_score <= 25),
  logic_score INTEGER NOT NULL CHECK (logic_score >= 0 AND logic_score <= 25),
  evidence_score INTEGER NOT NULL CHECK (evidence_score >= 0 AND evidence_score <= 25),
  defense_score INTEGER NOT NULL CHECK (defense_score >= 0 AND defense_score <= 25),
  clarity_explanation TEXT NOT NULL,
  logic_explanation TEXT NOT NULL,
  evidence_explanation TEXT NOT NULL,
  defense_explanation TEXT NOT NULL,
  clarity_suggestion TEXT NOT NULL,
  logic_suggestion TEXT NOT NULL,
  evidence_suggestion TEXT NOT NULL,
  defense_suggestion TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.argument_scores ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own scores"
ON public.argument_scores FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scores"
ON public.argument_scores FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scores"
ON public.argument_scores FOR DELETE
USING (auth.uid() = user_id);

-- Public read policy for leaderboard (aggregated, no personal data exposed)
CREATE POLICY "Anyone can read scores for leaderboard"
ON public.argument_scores FOR SELECT
USING (true);

-- Create a profiles table for display names on leaderboard
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Leaderboard view (aggregated data)
CREATE OR REPLACE VIEW public.leaderboard_stats AS
SELECT 
  s.user_id,
  p.display_name,
  MAX(s.total_score) AS highest_score,
  ROUND(AVG(s.total_score))::integer AS avg_score,
  COUNT(s.id)::integer AS total_arguments,
  MAX(s.created_at) AS last_active
FROM public.argument_scores s
LEFT JOIN public.profiles p ON s.user_id = p.user_id
GROUP BY s.user_id, p.display_name;

-- Index for leaderboard queries
CREATE INDEX idx_argument_scores_user_id ON public.argument_scores(user_id);
CREATE INDEX idx_argument_scores_created_at ON public.argument_scores(created_at DESC);
CREATE INDEX idx_argument_scores_total_score ON public.argument_scores(total_score DESC);
