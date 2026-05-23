# Starter Story LATAM Intelligence Engine

Este proyecto es un motor automatizado que extrae casos de éxito de **Starter Story**, procesa sus transcripciones mediante Inteligencia Artificial (Gemini) para extraer dolores del mercado (Pain Points), modelo de negocio e ingresos, y posteriormente cruza esa información con el perfil del usuario (RPM) para sugerir nuevas propuestas de negocio viables en Latinoamérica.

## Herramienta de Desarrollo

Este proyecto fue desarrollado utilizando **Antigravity** como herramienta de asistencia de IA para el desarrollo. Antigravity permitió acelerar la planificación de la arquitectura, la generación de código y la iteración sobre los distintos módulos del sistema, manteniendo siempre al desarrollador en control de las decisiones técnicas y de diseño.

---

## Deployment

La aplicación está desplegada en **Vercel** y accesible públicamente en:

> [https://starter-story-intelligence-engine.vercel.app](https://starter-story-intelligence-engine.vercel.app)

Vercel fue elegido como plataforma de deployment por las siguientes razones:
- Integración nativa con repositorios GitHub (deploy automático en cada push a `main`)
- Soporte de primera clase para proyectos Vite + React sin configuración adicional
- CDN global con baja latencia para usuarios en LATAM
- Tier gratuito suficiente para el alcance del proyecto

---

## Arquitectura (The 3-Layer Build)
1. **Layer 1: Architecture & Data (Supabase)** - Persistencia 100% en la nube mediante PostgreSQL.
2. **Layer 2: Motor de Inteligencia (Python + Apify + Gemini)** - Extracción delegada a la nube de Apify y procesamiento RAG.
3. **Layer 3: Interfaz de Usuario (Vite + React)** - Un Wizard interactivo y Dashboard con temática "Hacker/Cyan" para consumir las propuestas.

---

## Esquema de Base de Datos (Supabase)

La base de datos relacional está diseñada en base a un esquema determinista para separar el "Raw Input" del "Processed Output".

### 1. `videos` (Raw Input & Extracted Meta)
Contiene la base de los casos de estudio crudos obtenidos vía **Apify SDK** y la metadata posteriormente estructurada por el LLM.
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
Registro histórico de ejecuciones del motor automatizado.
- `log_id` (PK, UUID)
- `timestamp` (DateTime) - Hora exacta de ejecución.
- `status` (Text) - Éxito o fallos.
- `videos_processed` (Int) - Cantidad de nuevos videos ingeridos.
- `details` (Text) - Reporte de error o bitácora detallada.

*(Las tablas `users_rpm`, `business_proposals` y `mvt_evidence` acompañan el esquema para el posterior cálculo y cruce de datos de las soluciones generadas).*

---

## Extracción de Datos
El motor de extracción (`tools/apify_scraper.py`) utiliza la infraestructura de **Apify** para garantizar la ingesta de datos sin bloqueos de IP, operando de forma coordinada con el motor de IA (`tools/llm_extractor.py`) para el procesamiento de transcripts.

---

## Fuentes de Investigación — Pain Points LATAM

Los pain points extrapolados al mercado latinoamericano están respaldados por investigación de fuentes institucionales de primer nivel:

### Banco Interamericano de Desarrollo (BID / IADB)
- **Digitalización de PyMEs en LATAM**: El BID documenta que las pequeñas y medianas empresas en América Latina enfrentan una brecha significativa de digitalización respecto a economías desarrolladas, con acceso limitado a herramientas tecnológicas asequibles y culturalmente adaptadas.
- Fuente: [iadb.org — Digital Transformation in Latin America and the Caribbean](https://publications.iadb.org/en/digital-transformation-public-employment-services-across-latin-america-and-caribbean)

### CEPAL (Comisión Económica para América Latina y el Caribe)
- **Brecha digital y productividad**: La CEPAL identifica que la baja adopción tecnológica en PyMEs latinoamericanas es uno de los principales factores que limita su productividad y competitividad regional. El Anuario Estadístico 2023 de la CEPAL documenta indicadores económicos y sociodemográficos que sustentan la identificación de mercados objetivo.
- **Digitalización gubernamental y empresarial**: Estudios de CEPAL sobre transformación digital en la región confirman que sectores como fintech, logística, salud y educación presentan las mayores brechas de soluciones digitales accesibles.
- Fuente: [cepal.org — Anuario Estadístico de América Latina y el Caribe 2023](https://www.cepal.org/en/publications/68991-anuario-estadistico-america-latina-caribe-2023-statistical-yearbook-latin-america)

### Banco Mundial
- **Conectividad y crecimiento económico**: El Banco Mundial estima que la digitalización puede impulsar significativamente el PIB regional, con proyecciones de crecimiento del 2.3-2.6% para 2024-2025, donde la adopción tecnológica en PyMEs es un factor clave.
- Fuente: [worldbank.org — Digital Solutions Can Fuel Growth in Latin America](https://www.worldbank.org/en/news/press-release/2023/10/04/conectividad-digital-impulsa-crecimiento-inclusion-perspectivas-america-latina-caribe)

### Atlantico — Latin America Digital Transformation Report 2023
- **PyMEs y productividad digital**: Este reporte especializado en ecosistemas digitales LATAM documenta que la digitalización de PyMEs puede cerrar la brecha de productividad respecto a economías más desarrolladas, siendo este el segmento con mayor potencial de impacto.
- Fuente: [atlantico.vc — Latin America Digital Transformation Report 2023](https://www.atlantico.vc/latin-america-digital-transformation-report-2023)

---

## Motor Dinámico — Prueba de Reactividad RPM

El sistema está diseñado para ser completamente reactivo al perfil del usuario. Cuando el perfil RPM cambia, las propuestas generadas cambian en consecuencia.

**Cómo funciona:**
1. El usuario completa el Wizard RPM con sus Resultados, Propósito y Plan de Acción Masiva
2. Al presionar "Inyectar Motor IA" en el Motor de Soluciones, el sistema consulta el perfil RPM guardado en Supabase
3. Gemini cruza ese perfil con los pain points LATAM y los videos clasificados para generar propuestas personalizadas
4. Si el usuario modifica su RPM y vuelve a inyectar el motor, las propuestas cambian reflejando el nuevo perfil

**Prueba destructiva documentada:**
- Perfil RPM original: orientado a software B2B para PyMEs → propuestas generadas: herramientas SaaS de productividad
- Perfil RPM modificado: orientado a contenido y marketing digital → propuestas generadas: herramientas de contenido localizado para LATAM
- Resultado: el motor genera un set completamente diferente de propuestas, confirmando que no hay resultados hardcodeados y que el cruce es dinámico y dependiente del perfil del usuario

---

## Cómo levantar el proyecto localmente

### Requisitos previos
- Python 3.10+
- Node.js 18+
- Cuentas activas en: Supabase, Apify, Google AI Studio (Gemini)

### 1. Clonar el repositorio
```bash
git clone https://github.com/ROBERTONSON/Starter-Story-Intelligence-Engine.git
cd Starter-Story-Intelligence-Engine
```

### 2. Configurar variables de entorno del backend
Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:
```
SUPABASE_URL=tu_supabase_url
SUPABASE_KEY=tu_supabase_anon_key
GEMINI_API_KEY=tu_gemini_api_key
APIFY_API_TOKEN=tu_apify_token
```

### 3. Instalar dependencias Python
```bash
pip install -r requirements.txt
```

### 4. Inicializar la base de datos
Ejecuta el schema SQL en el editor de Supabase:
```
tools/init_schema.sql
tools/upgrade_schema.sql
```

### 5. Configurar variables de entorno del frontend
Crea `webapp/.env.local` basándote en `webapp/.env.local.example`:
```
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_GEMINI_API_KEY=tu_gemini_api_key
```

### 6. Instalar dependencias y levantar el frontend
```bash
cd webapp
npm install
npm run dev
```

La app estará disponible en `http://localhost:5173`

### 7. Ejecutar el pipeline de datos (orden recomendado)
```bash
# Extraer videos del canal Starter Story
python tools/apify_scraper.py

# Procesar transcripciones con IA (extrae business_model, revenue, entrepreneur_action)
python tools/llm_extractor.py

# Clasificar videos contra pain points LATAM
python tools/video_classifier.py
```

> **Nota:** El pipeline usa la API gratuita de Gemini que tiene un límite de 20 requests/día. Si se alcanza el límite, espera 24 horas y vuelve a ejecutar.
