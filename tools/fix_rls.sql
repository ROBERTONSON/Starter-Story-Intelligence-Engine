-- Este script desactiva la Seguridad a Nivel de Fila (RLS)
-- Esto permite que nuestro script de Python con llave anónima pueda guardar datos

ALTER TABLE public.videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraper_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.latam_pain_points DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_rpm DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_proposals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mvt_evidence DISABLE ROW LEVEL SECURITY;
