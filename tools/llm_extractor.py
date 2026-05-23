import os
import sys
import json
import time
from dotenv import load_dotenv

try:
    from supabase import create_client, Client
except ImportError:
    print("Please install supabase: pip install supabase")
    sys.exit(1)

try:
    import google.generativeai as genai
except ImportError:
    print("Please install google-generativeai: pip install google-generativeai")
    sys.exit(1)

def get_supabase_client() -> Client:
    load_dotenv()
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        print("Missing SUPABASE_URL or SUPABASE_KEY")
        sys.exit(1)
    return create_client(url, key)

def get_gemini_model():
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Missing GEMINI_API_KEY")
        sys.exit(1)
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-2.5-flash')

def extract_pain_point(model, video_title: str, transcript: str):
    prompt = f"""
You are an expert business analyst focusing on the Latin American (LATAM) market.
I will give you a video title and its transcript (or description) of a successful business case study from Starter Story.

Your task:
1. Extract exactly what the entrepreneur does.
2. Extract their business model.
3. Extract their revenue numbers.
4. Extrapolate the core business problem they solved into a LATAM context pain point.

Respond STRICTLY in JSON format matching exactly this schema:
{{
    "entrepreneur_action": "string (Briefly, what does the entrepreneur do/sell?)",
    "business_model": "string (e.g., SaaS, E-commerce, Info Product, Agency)",
    "revenue": "string (Exact revenue metric mentioned, e.g., $10K/mo. If none, 'No especificado')",
    "pain_point": {{
        "category": "string (e.g. B2B SaaS, Logistics, Fintech)",
        "description": "string (A detailed paragraph explaining the specific LATAM pain point extrapolated from the video)",
        "target_market": "string (e.g. PyMEs in Mexico, General LATAM)",
        "severity_score": int (1-100)
    }}
}}

Do NOT include any markdown formatting like ```json or anything else outside the JSON object. Just the raw JSON string.

Video Title: {video_title}
Transcript/Description: {transcript[:4000]}
"""
    response = model.generate_content(prompt)
    raw_text = response.text.strip()
    
    if raw_text.startswith("```json"):
        raw_text = raw_text[7:]
    if raw_text.endswith("```"):
        raw_text = raw_text[:-3]
        
    raw_text = raw_text.strip()
    return json.loads(raw_text)

def run_extractor():
    supabase = get_supabase_client()
    model = get_gemini_model()
    
    print("Fetching videos from Supabase...")
    videos_res = supabase.table("videos").select("video_id, title, transcript_text, business_model").execute()
    videos = videos_res.data
    
    # Procesar videos que no tengan business_model extraído aún
    videos_to_process = [v for v in videos if not v.get('business_model')]
    
    print(f"Found {len(videos_to_process)} videos to process for Pain Points.")
    
    # We need to process enough videos to ensure at least 20 have fully complete metadata
    limit = 8
    to_process = videos_to_process[:limit]
    if len(videos_to_process) > limit:
        print(f"Processing first {limit} with delays to respect Gemini limits.")
        
    for video in to_process:
        vid = video['video_id']
        print(f"Extracting AI Data from video: {video['title']}")
        try:
            data = extract_pain_point(model, video['title'], video['transcript_text'])
            pp_data = data["pain_point"]
            
            # Save LATAM Pain Point
            pp_entry = {
                "pain_point_id": vid,
                "category": pp_data["category"],
                "description": pp_data["description"],
                "target_market": pp_data["target_market"],
                "severity_score": pp_data["severity_score"]
            }
            supabase.table("latam_pain_points").upsert(pp_entry).execute()
            
            # Update Video Table with extracted metadata
            video_update = {
                "entrepreneur_action": data["entrepreneur_action"],
                "business_model": data["business_model"],
                "revenue": data["revenue"]
            }
            supabase.table("videos").update(video_update).eq("video_id", vid).execute()
            
            print(f"  [+] Saved Pain Point & Metadata ({data['business_model']} | {data['revenue']})")
            
            print("  [zZz] Sleeping 15 seconds to respect Gemini 5 RPM limit...")
            time.sleep(15)
            
        except Exception as e:
            print(f"  [-] Failed to extract/save data for {vid}: {e}")

if __name__ == "__main__":
    run_extractor()
