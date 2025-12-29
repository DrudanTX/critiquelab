-- Create saved_critiques table to store critique history
CREATE TABLE public.saved_critiques (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  input_text TEXT NOT NULL,
  primary_objection TEXT NOT NULL,
  logical_flaws JSONB NOT NULL DEFAULT '[]',
  weak_assumptions JSONB NOT NULL DEFAULT '[]',
  counterarguments JSONB NOT NULL DEFAULT '[]',
  real_world_failures JSONB NOT NULL DEFAULT '[]',
  argument_strength_score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saved_critiques ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own saved critiques" 
ON public.saved_critiques 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved critiques" 
ON public.saved_critiques 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved critiques" 
ON public.saved_critiques 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_saved_critiques_user_id ON public.saved_critiques(user_id);
CREATE INDEX idx_saved_critiques_created_at ON public.saved_critiques(created_at DESC);