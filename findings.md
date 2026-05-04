# Findings

## Research
- **Content Origin**: Emplearemos @starterstory en YouTube transcribiendo videos de casos de estudio sobre emprendimientos como fuente principal de ideas empresariales de alto valor.
- **Opportunity Matrix**: Cruzar 8+ pain points validados de Latinoamérica con el modelo de negocio extraído del video para proponer una idea.
- **RAG Architecture**: Se requiere un Retrieval-Augmented Generation (RAG) empujado por un LLM API que indexe las transcripciones y proponga cruces a partir del User Profile RPM.

## Discoveries
- **Incremental Logic**: El scraper de YouTube debe ser ligero y solo traer deltas (videos nuevos o no pre-analizados).
- **Reactive Workflow**: Cualquier cambio en el widget de RPM UI debe recalcular el 'fit score' de las propuestas presentadas en la WebApp de manera casi en tiempo real (o async si los llamados a la API toman tiempo).

## Constraints
- **Strict DB persistence barrier**: No se pueden guardar datos críticos en memoria. Todo estado reside en Supabase/PostgreSQL/Firestore. 
- **Verificabilidad Strict (MVT)**: El payload final exige un test empírico MVT real reportable mediante 5 pasos de evidencia auditables. No se pueden generar mocks de esta sección.
