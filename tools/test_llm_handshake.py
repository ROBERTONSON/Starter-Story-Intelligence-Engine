import os
import sys
from dotenv import load_dotenv

try:
    import google.generativeai as genai
except ImportError:
    print("Error: Please install google-generativeai package: pip install google-generativeai")
    sys.exit(1)

def test_gemini_handshake():
    print("Loading .env file...")
    load_dotenv()
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in .env")
        sys.exit(1)
        
    print("Configuring Gemini API...")
    genai.configure(api_key=api_key)
    
    print("Discovering available Gemini models...")
    try:
        available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        if not available_models:
            print("\n[FAIL] No models available for this API key that support generateContent.")
            sys.exit(1)
            
        selected_model = available_models[0]
        print(f"Sending ping to {selected_model}...")
        
        model = genai.GenerativeModel(selected_model.replace('models/', ''))
        response = model.generate_content("Respond exactly with the word: HANDSHAKE_SUCCESSFUL")
        
        print("\n--- GEMINI RESPONSE ---")
        print(response.text.strip())
        print("-----------------------")
        
        if "HANDSHAKE_SUCCESSFUL" in response.text:
            print("\n[SUCCESS] LLM Handshake Verified Successfully!")
        else:
            print("\n[WARNING] LLM Handshake returned unexpected response.")
            
    except Exception as e:
        print(f"\n[FAIL] LLM Handshake Failed: {str(e)}")

if __name__ == "__main__":
    test_gemini_handshake()
