-- Migración: Agregar columnas de clasificación IA a la tabla videos
-- Ejecutar en: Supabase Dashboard > SQL Editor
ALTER TABLE videos ADD COLUMN IF NOT EXISTS pain_point_match TEXT;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS relevance_score INTEGER DEFAULT 0;
