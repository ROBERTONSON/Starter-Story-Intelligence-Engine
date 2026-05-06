# Brain / LLM SOP

## Goal
Process video transcripts and user RPM data to generate viable business proposals using the Gemini API.

## Strategy (RAG & Extraction)
1. **Dynamic Pain Point Extraction**: Read unprocessed transcripts from the DB. Send them to Gemini with a prompt to identify the core business problem and extrapolate how it manifests in Latin America. Save this dynamically generated data into `latam_pain_points`.
2. Fetch latest RPM profile from DB.
3. Fetch a pool of relevant video transcripts and their extrapolated pain points.
4. Inject the context into the Gemini Prompt.
5. Instruct Gemini to generate a JSON output matching the `BusinessProposal` schema in `gemini.md`.
6. Write the generated proposals back to the database with their respective `fit_score`.

## Invariants
- **Recalculation logic:** Only run if the RPM or pain points are updated, or if manually scheduled.
- Enforce strict JSON output from the LLM.
