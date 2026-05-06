-- Drop tables if they exist to allow clean recreation (optional, use with care)
-- DROP TABLE IF EXISTS public.mvt_evidence CASCADE;
-- DROP TABLE IF EXISTS public.business_proposals CASCADE;
-- DROP TABLE IF EXISTS public.users_rpm CASCADE;
-- DROP TABLE IF EXISTS public.latam_pain_points CASCADE;
-- DROP TABLE IF EXISTS public.scraper_logs CASCADE;
-- DROP TABLE IF EXISTS public.videos CASCADE;

-- Create videos table (Raw Input)
CREATE TABLE public.videos (
    video_id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    transcript_text TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create latam_pain_points table (Raw Input)
CREATE TABLE public.latam_pain_points (
    pain_point_id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    target_market TEXT NOT NULL,
    severity_score INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create users_rpm table (Raw Input)
CREATE TABLE public.users_rpm (
    user_id TEXT PRIMARY KEY,
    results_desired JSONB DEFAULT '[]'::jsonb,
    purpose JSONB DEFAULT '[]'::jsonb,
    massive_action_plan JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create scraper_logs table (Processed Output)
CREATE TABLE public.scraper_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL,
    videos_processed INTEGER DEFAULT 0,
    details TEXT
);

-- Create business_proposals table (Processed Output)
CREATE TABLE public.business_proposals (
    proposal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    fit_score NUMERIC(5,2) NOT NULL,
    target_pain_point_id TEXT REFERENCES public.latam_pain_points(pain_point_id),
    source_video_ids JSONB DEFAULT '[]'::jsonb,
    actionable_steps JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create mvt_evidence table (Processed Output)
CREATE TABLE public.mvt_evidence (
    mvt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES public.business_proposals(proposal_id),
    validation_status TEXT NOT NULL,
    evidence_logs JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: Row Level Security (RLS) is disabled by default. 
-- Since this database is accessed by our secure Python backend and NextJS server actions,
-- keeping RLS disabled initially is fine for development.
