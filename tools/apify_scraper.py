import os
import json
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
    
    # Actor público genérico de YouTube en Apify.
    actor_id = "streamers/youtube-scraper" 
    
    # Lista de nichos para garantizar que siempre encuentre videos distintos y la base de datos crezca en la demo
    nichos = ["vending machine", "pressure washing", "cleaning business", "lawn care", "notion template", "dog walking", "newsletter", "smma", "seo agency", "clothing brand", "real estate", "airbnb"]
    nicho_elegido = random.choice(nichos)
    
    run_input = {
        "searchKeywords": f"Starter Story {nicho_elegido}",
        "maxResults": 5,
        "maxResultsShorts": 0
    }

    print(f"Llamando al Actor de Apify: {actor_id}")
    # Esto inicia la ejecución en la nube de Apify y espera a que termine
    run = apify_client.actor(actor_id).call(run_input=run_input)
    
    print("✅ Apify terminó la ejecución. Descargando datos...")
    
    # Obtener los resultados del dataset generado por Apify
    dataset_items = apify_client.dataset(run["defaultDatasetId"]).list_items().items
    
    videos_procesados = 0
    for item in dataset_items:
        try:
            video_id = item.get("id") or item.get("url", "").split("v=")[-1]
            title = item.get("title", "Sin título")
            url = item.get("url", f"https://www.youtube.com/watch?v={video_id}")
            
            # Dependiendo del actor, el texto largo viene en 'text', 'description' o 'textOriginal'
            transcript_text = item.get("text") or item.get("description") or item.get("textOriginal") or ""
            
            if not transcript_text:
                continue

            # Inyectamos a Supabase
            data = {
                "video_id": video_id[:255],  # Asegurar límite de tamaño
                "url": url,
                "title": title,
                "transcript_text": transcript_text[:5000] # Límite por seguridad
            }
            
            # Upsert: Si el video ya existe, se actualiza. Si no, se crea.
            supabase.table("videos").upsert(data).execute()
            videos_procesados += 1
            print(f"Guardado en DB: {title}")
            
        except Exception as e:
            print(f"Error guardando item de Apify en DB: {e}")

    # Guardar log de ejecución
    supabase.table("scraper_logs").insert({
        "status": "APIFY_SUCCESS",
        "videos_processed": videos_procesados,
        "details": f"Extraídos usando Apify Actor: {actor_id}"
    }).execute()
    
    print(f"🎉 Scraping con Apify finalizado. {videos_procesados} videos nuevos listos para la IA.")

if __name__ == "__main__":
    scrape_starter_story_with_apify()
