# Database SOP

## Goal
Manage persistent state for all layers using Supabase PostgreSQL.

## Schemas
Refer to `gemini.md` for exact JSON schemas (Raw Inputs and Processed Payloads).

## Connection
Use the official `supabase-py` client (or equivalent) using `SUPABASE_URL` and `SUPABASE_KEY` from `.env`.

## Core Operations Needed
- `check_if_video_exists(video_id)`
- `save_video_transcript(data)`
- `log_scraper_execution(log_data)`
- `save_business_proposal(proposal)`
- `update_user_rpm(user_id, rpm_data)`

## Invariants
- The DB is the single source of truth.
- Local `.tmp/` is only for intermediate execution.
