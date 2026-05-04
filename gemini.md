# Master Data Schema and Environment

## Data Schemas

### 1. Raw Input Schema
```json
{
  "VideoTranscript": {
    "video_id": "string",
    "url": "string",
    "title": "string",
    "transcript_text": "string",
    "published_at": "datetime"
  },
  "LatamPainPoint": {
    "pain_point_id": "string",
    "category": "string",
    "description": "string",
    "target_market": "string",
    "severity_score": "int"
  },
  "UserProfileRPM": {
    "user_id": "string",
    "results_desired": ["string"],
    "purpose": ["string"],
    "massive_action_plan": ["string"]
  }
}
```

### 2. Processed Output (Payload) Schema
```json
{
  "BusinessProposal": {
    "proposal_id": "string",
    "title": "string",
    "description": "string",
    "fit_score": "float",
    "target_pain_point_id": "string",
    "source_video_ids": ["string"],
    "actionable_steps": ["string"]
  },
  "ScraperLog": {
    "log_id": "string",
    "timestamp": "datetime",
    "status": "string",
    "videos_processed": "int",
    "details": "string"
  },
  "MVTEvidence": {
    "mvt_id": "string",
    "proposal_id": "string",
    "validation_status": "string",
    "evidence_logs": [
      {
        "step": "int", 
        "description": "string", 
        "media_url": "string"
      }
    ]
  }
}
```

## Variables
- **Delivery Payload Destination**: Interactive Web App.
- **Source of Truth**: Central Database (Supabase/PostgreSQL o Firebase).
- **Integrations**: YouTube Transcript Scraper, LLM API, Web App Backend, DB.

## Behavioral Rules (System Constitution)
1. **Scraping**: Automatic, incremental (new videos only), scheduled via UI.
2. **Recalculation**: Changing RPM or Pain Points triggers automatic reassessment and updates proposals.
3. **Logging**: Cada ejecución del scraper queda registrada con su timestamp, elementos encontrados o errores detallados.
4. **DO NOTS**:
   - DO NOT usar almacenamiento temporal o en memoria para datos críticos. DB MANDA.
   - DO NOT hardcodear propuestas o datos de videos.
   - DO NOT fabricar evidencia para el MVT.
