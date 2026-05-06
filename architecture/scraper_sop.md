# Scraper SOP (Standard Operating Procedure)

## Goal
Extract transcripts and metadata from YouTube videos without relying on the official YouTube API v3 to avoid quotas and access raw content.

## Strategy
1. Retrieve a list of URLs/Video IDs from a predefined source.
2. For each Video ID, check the database `videos` table to see if it's already processed.
3. If new, use a library (e.g., `youtube_transcript_api`) to download the transcript.
4. Push raw text and metadata to the database.

## Invariants
- Do not store transcripts in memory; write directly to `.tmp/` if needed, then push to Supabase.
- Always log success/failure to `ScraperLog` in the database.
