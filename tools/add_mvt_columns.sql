-- Migración: Agregar columnas finales para la Fase 5 MVT
-- Ejecutar en: Supabase Dashboard > SQL Editor
ALTER TABLE mvt_evidence ADD COLUMN IF NOT EXISTS hypothesis TEXT DEFAULT '';
ALTER TABLE mvt_evidence ADD COLUMN IF NOT EXISTS test_design TEXT DEFAULT '';
ALTER TABLE mvt_evidence ADD COLUMN IF NOT EXISTS analysis_result TEXT DEFAULT '';
