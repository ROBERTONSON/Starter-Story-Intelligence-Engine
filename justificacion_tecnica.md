# Justificación Técnica - Starter Story Intelligence Engine

Este documento da cumplimiento a los requerimientos técnicos avanzados de la rúbrica de evaluación de la asignatura.

## 1. Enfoque de Scraping y Extracción (Arquitectura Basada en Apify)
**Problema:** La extracción de datos nativa o local desde plataformas cerradas como YouTube presenta problemas graves de escalabilidad, bloqueos de IP (Error 403) y barreras de CAPTCHA al detectar peticiones *headless* masivas. Construir una infraestructura propia de proxies rotativos es ineficiente para este nivel de proyecto.

**Solución Técnica (Apify):** Se implementó una arquitectura de extracción delegada (Scraping-as-a-Service) utilizando la plataforma **Apify**. 
1. A través de su SDK (`apify-client` en Python), el backend se conecta directamente a los servidores de Apify.
2. Apify gestiona automáticamente la rotación de proxies residenciales, el *fingerprinting* de navegadores y la recolección paralela, evadiendo los bloqueos anti-bot de YouTube de manera nativa.
3. El script de conexión (`tools/apify_scraper.py`) solicita los metadatos y transcripciones, descarga el dataset en formato JSON, y lo inyecta limpiamente en nuestra base de datos PostgreSQL (Supabase) para la siguiente fase.

## 2. Extracción Estructurada por IA (Data Parsing)
Para cumplir con el requerimiento de procesamiento inteligente (no guardar solo texto plano), el flujo continúa en `tools/llm_extractor.py`.
En lugar de extraer entidades sueltas, forzamos al modelo `gemini-2.5-flash` a leer los textos capturados por Apify y devolver un objeto JSON estricto que extrae:
- `entrepreneur_action`: La acción específica del fundador.
- `business_model`: Su modelo de negocio (SaaS, E-commerce, etc).
- `revenue`: Métrica financiera exacta (ej. $10K/mo).

Esto enriquece la base de datos `videos` añadiendo metadata altamente estructurada y lista para consumo por el *Frontend* (Vite + React).
