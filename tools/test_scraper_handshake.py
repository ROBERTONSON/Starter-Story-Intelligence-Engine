import sys

try:
    from youtube_transcript_api import YouTubeTranscriptApi
except ImportError:
    print("Error: Please install youtube-transcript-api package: pip install youtube-transcript-api")
    sys.exit(1)

def test_scraper_handshake():
    # A known YouTube video ID to test the transcript extraction
    # "dQw4w9WgXcQ" -> Rick Astley (has auto/manual transcripts)
    video_id = "dQw4w9WgXcQ" 
    
    print(f"Attempting to fetch transcript for video ID: {video_id}...")
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        
        print("\n--- TRANSCRIPT SNIPPET ---")
        for entry in transcript[:3]:
            print(f"[{entry['start']:.2f}s] {entry['text']}")
        print("... (truncated)")
        print("--------------------------")
        
        print("\n[SUCCESS] Scraper Handshake Verified Successfully!")
        
    except Exception as e:
        print(f"\n[FAIL] Scraper Handshake Failed: {str(e)}")

if __name__ == "__main__":
    test_scraper_handshake()
