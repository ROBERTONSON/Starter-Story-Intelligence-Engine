## Sprint 0: Configuración y Arquitectura (Semana 1)
### El objetivo aquí es dejar el terreno listo y las decisiones técnicas tomadas (tus tareas actuales van aquí).

- [x] Crear repo GitHub privado e invitar al instructor (Prioridad: Alta)
- [ ] Elegir herramienta (Antigravity o Kiro) y justificar en README (Prioridad: Alta)
- [ ] Clonar proyecto Asana/Freedmap desde plantilla y compartir (Prioridad: Media)
- [x] Bosquejo de arquitectura de los 5 módulos en /docs/ (Prioridad: Alta)
- [x] Decisión de motor de base de datos (PostgreSQL, Supabase, etc.) (Prioridad: Alta)
- [x] Estrategia de extracción YouTube (API v3 vs Transcript scraper) (Prioridad: Alta)
- [ ] Elegir target de deployment (Vercel, Railway, Fly.io) (Prioridad: Media)
- [ ] Identificar fuentes LATAM (BID, CEPAL, Banco Mundial) (Prioridad: Alta)
- [x] Ejecutar Plan Mode / Spec con el doc del ejercicio en Antigravity (Prioridad: Alta)
- [ ] Ticket de salida: commit arquitectura + plan + Asana listo (Prioridad: Alta)

## Sprint 1: Scraper y Memoria (Fase 1 y 2)
### Aquí construimos el motor de extracción y la persistencia de datos.

- [x] Escribir script de extracción de metadata y transcripciones (Prioridad: Alta)
- [x] Implementar lógica de scraping incremental (solo lo nuevo) (Prioridad: Alta)
- [x] Configurar el schedule (cron job) para ejecución en background (Prioridad: Alta)
- [x] Crear tablas/colecciones según el JSON Data Schema (Prioridad: Alta)
- [x] Implementar registro de logs del scraper con timestamps (Prioridad: Alta)
- [x] Ejecutar scraper y poblar base de datos con mínimo 30 videos (Prioridad: Alta)

## Sprint 2: El Cerebro y el Usuario (Fase 3)
### Dotamos de inteligencia a la app y construimos la interfaz del usuario.

- [x] Ingresar los 8 pain points LATAM investigados a la base de datos (Prioridad: Alta) *[Cancelado/Sustituido: Se generarán dinámicamente vía IA en el siguiente paso]*
- [x] Crear prompt de IA para clasificar videos según los pain points (Prioridad: Alta)
- [x] Implementar función que re-clasifique si se editan los pain points (Prioridad: Alta) *[Dinámico integrado]*
- [x] Crear UI del flujo paso a paso (Questions R, P y M separadas) (Prioridad: Media)
- [ ] Agregar textos de ayuda contextual y profundización progresiva en UI (Prioridad: Media)
- [ ] Conectar LLM para procesar las respuestas y generar el resumen estructurado (Prioridad: Alta)

## Sprint 3: El Motor de Valor (Fase 4)
### Donde ocurre la magia: cruzar RPM + Pain Points + Videos.

- [ ] Programar query de base de datos para buscar videos afines al RPM (Prioridad: Alta)
- [ ] Diseñar prompt maestro que genere 4+ propuestas adaptadas a LATAM (Prioridad: Alta)
- [ ] Calcular e inyectar el "Score de fit" y la "Dificultad" en la UI (Prioridad: Media)
- [ ] Prueba destructiva local: Cambiar el RPM y verificar que cambien las propuestas (Prioridad: Alta)

## Sprint 4: La Calle y la Entrega (Fase 5)
### Validación real con humanos y pulido final de la entrega.

- [ ] Inmersión: Hablar con 5 personas reales y subir capturas/audio (Prioridad: Alta)
- [ ] Hipótesis: Documentar en la app las 2-3 suposiciones críticas (Prioridad: Alta)
- [ ] Test: Diseñar y lanzar test mínimo (Landing, mensaje, prototipo) (Prioridad: Alta)
- [ ] Análisis: Subir documento de decisión (métrica real vs esperada) a la app (Prioridad: Alta)
- [ ] Desplegar la aplicación final en vivo (Vercel/Railway/etc.) (Prioridad: Alta)
- [ ] Grabar video demo de máximo 5 minutos mostrando el flujo (Prioridad: Alta)