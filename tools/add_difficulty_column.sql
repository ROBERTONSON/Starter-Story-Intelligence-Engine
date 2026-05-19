-- Migración: Agregar columna de dificultad a las propuestas de negocio
-- Ejecutar en: Supabase Dashboard > SQL Editor
ALTER TABLE business_proposals ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'Media';
