-- Actualización de esquema para cumplir con rúbrica
-- Agrega campos extraídos por IA directamente a la tabla de videos

ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS entrepreneur_action TEXT;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS business_model TEXT;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS revenue TEXT;
