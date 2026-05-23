import os
import random
from dotenv import load_dotenv
from apify_client import ApifyClient
from supabase import create_client, Client

# Cargar variables de entorno
load_dotenv()

APIFY_API_TOKEN = os.getenv("APIFY_API_TOKEN")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not APIFY_API_TOKEN:
    raise ValueError("Falta APIFY_API_TOKEN en el archivo .env")

# Inicializar clientes
apify_client = ApifyClient(APIFY_API_TOKEN)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def scrape_starter_story_with_apify():
    print("🚀 Iniciando extracción con Apify...")
    
    actor_id = "streamers/youtube-scraper"
    TARGET_NEW_VIDEOS = 10  # Videos genuinamente nuevos que queremos guardar

    # Apuntar DIRECTAMENTE al canal oficial de Starter Story
    STARTER_STORY_CHANNEL = "https://www.youtube.com/@StarterStory/videos"

    run_input = {
        "startUrls": [{ "url": STARTER_STORY_CHANNEL }],
        "maxResults": 40,  # Traer suficientes para encontrar videos más allá de los ya guardados
        "maxResultsShorts": 0
    }

    print(f"Scrapeando canal oficial Starter Story | Solicitando {TARGET_NEW_VIDEOS * 4} resultados a Apify...")
    run = apify_client.actor(actor_id).call(run_input=run_input)

    print("✅ Apify terminó. Filtrando videos nuevos...")
    dataset_items = apify_client.dataset(run["defaultDatasetId"]).list_items().items

    videos_nuevos = 0
    videos_duplicados = 0
    videos_sin_transcript = 0

    for item in dataset_items:
        # Parar cuando ya tengamos el target cubierto
        if videos_nuevos >= TARGET_NEW_VIDEOS:
            break

        try:
            video_id = item.get("id") or item.get("url", "").split("v=")[-1]
            title = item.get("title", "Sin título")
            url = item.get("url", f"https://www.youtube.com/watch?v={video_id}")
            transcript_text = item.get("text") or item.get("description") or item.get("textOriginal") or ""

            if not transcript_text:
                videos_sin_transcript += 1
                print(f"  [SKIP] Sin transcripción: {title}")
                continue

            # Filtrar estrictamente por el canal Starter Story
            channel_name = item.get("channelName") or item.get("author") or ""
            if "starter story" not in channel_name.lower():
                print(f"  [SKIP] No es del canal Starter Story (es de '{channel_name}'): {title}")
                continue

            # Verificar si ya existe en la BD antes de contar
            existing = supabase.table("videos").select("video_id").eq("video_id", video_id[:255]).execute()
            if len(existing.data) > 0:
                videos_duplicados += 1
                print(f"  [DUPLICADO] Ya existe: {title}")
                continue

            # Es genuinamente nuevo → lo guardamos
            data = {
                "video_id": video_id[:255],
                "url": url,
                "title": title,
                "transcript_text": transcript_text[:5000]
            }
            supabase.table("videos").upsert(data).execute()
            videos_nuevos += 1
            print(f"  [NUEVO ✅] {videos_nuevos}/{TARGET_NEW_VIDEOS}: {title}")

        except Exception as e:
            print(f"Error procesando item: {e}")

    # Guardar log detallado en Supabase
    supabase.table("scraper_logs").insert({
        "status": "APIFY_SUCCESS",
        "videos_processed": videos_nuevos,
        "details": f"Canal: Starter Story (Oficial) | Nuevos: {videos_nuevos}/{TARGET_NEW_VIDEOS} | Duplicados: {videos_duplicados} | Sin transcript: {videos_sin_transcript}"
    }).execute()

    print(f"\n🎉 Extracción finalizada. Nuevos: {videos_nuevos} | Duplicados saltados: {videos_duplicados} | Sin transcript: {videos_sin_transcript}")

if __name__ == "__main__":
    scrape_starter_story_with_apify()
