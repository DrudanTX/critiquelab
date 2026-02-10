
-- Fix: Replace security definer view with security invoker view
DROP VIEW IF EXISTS public.leaderboard_stats;

CREATE OR REPLACE VIEW public.leaderboard_stats
WITH (security_invoker = on) AS
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
