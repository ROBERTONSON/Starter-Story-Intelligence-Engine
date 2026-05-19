"""
video_classifier.py
Clasifica cada video en la BD contra los pain points LATAM usando Gemini.
Uso: python tools/video_classifier.py
"""
import os
import json
import time
from dotenv import load_dotenv
import google.generativeai as genai
from supabase import create_client

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

def classify_videos():
    print("🔍 Cargando pain points LATAM...")
    pain_points = supabase.table("latam_pain_points").select("category, description").execute().data

    print("📹 Cargando videos procesados...")
    # Obtenemos todos los videos y filtramos los que tengan business_model y NO tengan pain_point_match
    all_videos = supabase.table("videos").select("video_id, title, business_model, entrepreneur_action, pain_point_match").execute().data
    videos = [v for v in all_videos if v.get("business_model") is not None and not v.get("pain_point_match")]

    if not pain_points or not videos:
        print("❌ No hay datos suficientes para clasificar.")
        return

    pp_list = "\n".join([f"- {p['category']}: {p['description'][:100]}" for p in pain_points])
    total = len(videos)
    print(f"✅ {total} videos para clasificar contra {len(pain_points)} pain points.\n")

    import re

    for i, video in enumerate(videos):
        prompt = f"""Eres un clasificador de negocios LATAM.

Video: {video['title']}
Modelo de Negocio: {video.get('business_model', 'N/A')}
Acción del Emprendedor: {video.get('entrepreneur_action', 'N/A')}

Pain Points disponibles:
{pp_list}

Devuelve SOLO un objeto JSON. No agregues texto antes ni después. Formato:
{{"matched_pain_point": "nombre exacto de categoría", "relevance_score": número 0-100}}"""

        try:
            response = model.generate_content(prompt)
            
            # Validar si la respuesta fue bloqueada por filtros de seguridad
            if not response.parts:
                print(f"  [{i+1}/{total}] ⚠️ Bloqueado por seguridad: {video['title'][:30]}")
                time.sleep(4)
                continue

            text = response.text
            
            # Buscar el primer { y el último } para aislar el JSON
            start = text.find('{')
            end = text.rfind('}')
            
            if start != -1 and end != -1:
                json_str = text[start:end+1]
                result = json.loads(json_str)
                
                supabase.table("videos").update({
                    "pain_point_match": result.get("matched_pain_point", "Sin clasificar"),
                    "relevance_score": result.get("relevance_score", 0)
                }).eq("video_id", video["video_id"]).execute()

                print(f"  [{i+1}/{total}] ✅ {video['title'][:40]} → {result.get('matched_pain_point')} ({result.get('relevance_score')}%)")
            else:
                print(f"  [{i+1}/{total}] ❌ Error de formato JSON en: {video['title'][:30]}")

        except Exception as e:
            print(f"  [{i+1}/{total}] ❌ Error en {video['video_id'][:15]}: {str(e)[:50]}")

        time.sleep(6)  # Rate limit protection extremo (10 RPM)

    print(f"\n🎉 Clasificación completada. {total} videos procesados.")

if __name__ == "__main__":
    classify_videos()
