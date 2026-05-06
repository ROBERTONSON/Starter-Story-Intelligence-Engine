# Justificación Técnica - Starter Story Intelligence Engine

Este documento da cumplimiento a los requerimientos técnicos avanzados de la rúbrica de evaluación.

## 1. Enfoque de Scraping y Extracción
**Problema:** La API oficial de YouTube impone cuotas estrictas y la librería nativa `youtube-transcript-api` suele sufrir bloqueos de IP (Error 403 / ParseError) cuando detecta peticiones "headless" en la nube o desde scripts sin cookies.
**Solución Técnica:** Se implementó una arquitectura de *Fallback Activo*. 
1. Se utiliza el buscador interno de la librería `yt-dlp` (comando `ytsearch30`) ya que simula una petición de cliente mucho más robusta y no requiere de un *JavaScript runtime* dedicado.
2. Si los subtítulos están bloqueados, el scraper extrae automáticamente la descripción rica del video, donde *Starter Story* siempre documenta los timestamps, ingresos y resúmenes del caso de estudio, garantizando la ingesta de datos.

## 2. Extracción Estructurada por IA (Data Parsing)
Para cumplir con el requerimiento de procesamiento inteligente (no guardar solo texto plano), diseñamos un prompt restrictivo en `tools/llm_extractor.py`.
En lugar de extraer entidades sueltas, forzamos al modelo `gemini-2.5-flash` a devolver un objeto JSON estricto que parsea automáticamente la transcripción para extraer:
- `entrepreneur_action`: Qué hace exactamente el emprendedor.
- `business_model`: Su modelo de negocio (SaaS, E-commerce, etc).
- `revenue`: Métrica financiera exacta (ej. $10K/mo).

Esto enriquece la base de datos `videos` añadiendo metadata altamente estructurada y lista para consumo por el *Frontend* (Vite + React).
