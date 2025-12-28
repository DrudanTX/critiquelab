-- Create table to track user critique usage
CREATE TABLE public.critique_usage (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.critique_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own usage
CREATE POLICY "Users can view their own critique usage"
ON public.critique_usage
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own usage records
CREATE POLICY "Users can insert their own critique usage"
ON public.critique_usage
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_critique_usage_user_id ON public.critique_usage(user_id);