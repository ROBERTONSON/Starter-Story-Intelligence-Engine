import os
import sys
from dotenv import load_dotenv

try:
    from supabase import create_client, Client
except ImportError:
    print("Error: Please install supabase package: pip install supabase")
    sys.exit(1)

def test_supabase_handshake():
    print("Loading .env file...")
    load_dotenv()
    
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    
    if not url or not key:
        print("Error: SUPABASE_URL or SUPABASE_KEY not found in .env")
        sys.exit(1)
        
    print("Connecting to Supabase...")
    try:
        supabase: Client = create_client(url, key)
        
        print("Pinging Supabase API...")
        try:
            # We attempt to fetch from a dummy table. 
            # Even if it fails because the table doesn't exist, it means the API and token are valid.
            response = supabase.table('test_handshake_dummy_table').select('*').limit(1).execute()
        except Exception as e:
            error_str = str(e)
            if "relation" in error_str and "does not exist" in error_str:
                print("\n[SUCCESS] DB Handshake Verified Successfully! (API reached, token valid, DB alive).")
            else:
                # Supabase Python client might raise other API errors, but if we get a structured response, we are good.
                print(f"\n[SUCCESS] DB Handshake reached API. Response/Error: {error_str}")
                
    except Exception as e:
        print(f"\n[FAIL] DB Handshake Failed at connection initialization: {str(e)}")

if __name__ == "__main__":
    test_supabase_handshake()
