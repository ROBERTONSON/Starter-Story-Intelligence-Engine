# Starter Story LATAM Intelligence Engine

Este proyecto es un motor automatizado que extrae casos de éxito de **Starter Story**, procesa sus transcripciones mediante Inteligencia Artificial (Gemini) para extraer dolores del mercado (Pain Points), modelo de negocio e ingresos, y posteriormente cruza esa información con el perfil del usuario (RPM) para sugerir nuevas propuestas de negocio viables en Latinoamérica.

## Arquitectura (The 3-Layer Build)
1. **Layer 1: Architecture & Data (Supabase)** - Persistencia 100% en la nube mediante PostgreSQL.
2. **Layer 2: Motor de Inteligencia (Python + Gemini)** - Scraper automatizado y extracción RAG de Pain Points.
3. **Layer 3: Interfaz de Usuario (Vite + React)** - Un Wizard interactivo y Dashboard con temática "Hacker/Cyan" para consumir las propuestas.

---

## Esquema de Base de Datos (Supabase)

La base de datos relacional está diseñada en base a un esquema determinista para separar el "Raw Input" del "Processed Output".

### 1. `videos` (Raw Input & Extracted Meta)
Contiene la base de los casos de estudio crudos obtenidos vía `yt-dlp` y la metadata posteriormente estructurada por el LLM.
- `video_id` (PK, Text)
- `url` (Text)
- `title` (Text)
- `transcript_text` (Text) - Transcripción completa.
- `entrepreneur_action` (Text) - *AI Extracted*: Qué hace el emprendedor.
- `business_model` (Text) - *AI Extracted*: Modelo de negocio (Ej. B2B SaaS).
- `revenue` (Text) - *AI Extracted*: Ingresos mensuales/anuales reportados.

### 2. `latam_pain_points` (Processed Output)
Almacena el problema central de cada negocio gringo, **extrapolado al mercado LATAM** mediante `gemini-2.5-flash`.
- `pain_point_id` (PK, Text) - Vinculado 1:1 con el video origen.
- `category` (Text) - Industria del dolor (Ej. Logística de Última Milla).
- `description` (Text) - Explicación detallada de cómo este dolor aplica en LATAM.
- `target_market` (Text) - Segmento demográfico/empresarial específico en LATAM.
- `severity_score` (Int) - Índice de severidad (1-100) determinado por la IA.

### 3. `scraper_logs` (System Analytics)
Registro histórico de ejecuciones del motor automatizado, vital para monitoreo del Cron Job.
- `log_id` (PK, UUID)
- `timestamp` (DateTime) - Hora exacta de ejecución.
- `status` (Text) - Éxito o fallos.
- `videos_processed` (Int) - Cantidad de nuevos videos ingeridos.
- `details` (Text) - Reporte de error o bitácora detallada.

*(Las tablas `users_rpm`, `business_proposals` y `mvt_evidence` acompañan el esquema para el posterior cálculo y cruce de datos de las soluciones generadas).*

## Automatización (Cron Job)
El scraper principal (`tools/scraper.py`) está configurado para ejecutarse en background todos los días a medianoche vía **GitHub Actions**. Esto asegura la ingesta continua de nuevos casos de negocio en nuestra base de datos.
