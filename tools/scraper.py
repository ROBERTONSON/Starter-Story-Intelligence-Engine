import os
import sys
import datetime
from dotenv import load_dotenv

# Try importing supabase
try:
    from supabase import create_client, Client
except ImportError:
    print("Please install supabase: pip install supabase")
    sys.exit(1)

# Try importing yt_dlp for fallback scraping
try:
    import yt_dlp
except ImportError:
    print("Please install yt-dlp: pip install yt-dlp")
    sys.exit(1)

from youtube_transcript_api import YouTubeTranscriptApi

def get_supabase_client() -> Client:
    load_dotenv()
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        print("Missing SUPABASE_URL or SUPABASE_KEY")
        sys.exit(1)
    return create_client(url, key)

def fetch_latest_videos(query: str = 'ytsearch30:"Starter Story"'):
    """Fetches 30 videos using YouTube search reliably."""
    print(f"Fetching 30 videos for query: {query}...")
    ydl_opts = {
        'extract_flat': 'in_playlist',
        'quiet': True
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        result = ydl.extract_info(query, download=False)
        if 'entries' in result:
            return [entry['id'] for entry in result['entries'] if entry.get('id')]
        return []

def fetch_transcript_fallback(video_url: str):
    """Uses yt-dlp to fetch video description as fallback when transcript blocks."""
    ydl_opts = {
        'skip_download': True,
        'writesubtitles': True,
        'writeautomaticsub': True,
        'subtitleslangs': ['en', 'es'],
        'quiet': True
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(video_url, download=False)
        # Description often has the structured breakdown of the business
        description = info.get('description', '')
        title = info.get('title', '')
        return title, description

def fetch_transcript(video_id: str):
    """Attempt primary fetch via Transcript API, fallback to yt-dlp if blocked."""
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['en', 'es'])
        text = " ".join([t['text'] for t in transcript_list])
        title, _ = fetch_transcript_fallback(f"https://www.youtube.com/watch?v={video_id}")
        return title, text
    except Exception as e:
        print(f"  -> Primary API failed for {video_id} ({type(e).__name__}). Using yt-dlp fallback...")
        return fetch_transcript_fallback(f"https://www.youtube.com/watch?v={video_id}")

def log_execution(supabase: Client, status: str, processed_count: int, details: str):
    log_entry = {
        "status": status,
        "videos_processed": processed_count,
        "details": details,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    try:
        supabase.table("scraper_logs").insert(log_entry).execute()
        print(f"Logged execution to DB: {status}")
    except Exception as e:
        print(f"Failed to log execution to DB: {e}")

def run_scraper():
    supabase = get_supabase_client()
    
    target_video_ids = fetch_latest_videos()
    
    if not target_video_ids:
        print("Could not fetch videos from channel.")
        return
        
    print("Fetching existing videos from DB to prevent duplicates...")
    existing_videos = []
    try:
        response = supabase.table("videos").select("video_id").execute()
        existing_videos = [row['video_id'] for row in response.data]
    except Exception as e:
        print(f"Error fetching existing videos from DB (are tables created?): {e}")
        return
    
    videos_to_process = [vid for vid in target_video_ids if vid not in existing_videos]
    print(f"Found {len(videos_to_process)} new videos to process. (Incremental scraping)")
    
    if not videos_to_process:
        log_execution(supabase, "SUCCESS", 0, "No new videos found in this run.")
        return

    processed_count = 0
    errors = []

    for vid in videos_to_process:
        print(f"Processing Video ID: {vid}...")
        try:
            title, transcript = fetch_transcript(vid)
            if not transcript:
                transcript = "No transcript or description available."
            
            video_data = {
                "video_id": vid,
                "url": f"https://www.youtube.com/watch?v={vid}",
                "title": title,
                "transcript_text": transcript,
                "published_at": datetime.datetime.utcnow().isoformat()
            }
            
            supabase.table("videos").insert(video_data).execute()
            print(f"  [+] Successfully saved '{title}' to database.")
            processed_count += 1
            
        except Exception as e:
            err_msg = f"Error processing {vid}: {str(e)}"
            print(f"  [-] {err_msg}")
            errors.append(err_msg)

    # Registro en la tabla de logs
    if errors:
        log_execution(supabase, "PARTIAL_SUCCESS_OR_ERROR", processed_count, " | ".join(errors))
    else:
        log_execution(supabase, "SUCCESS", processed_count, f"Processed {processed_count} videos correctly.")

if __name__ == "__main__":
    run_scraper()
