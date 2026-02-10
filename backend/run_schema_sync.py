#!/usr/bin/env python3
"""
PPN Research Portal - Schema Sync Runner
Automatically runs sync_schema.sql against Supabase database
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("❌ Error: Missing Supabase credentials in .env")
    print("Please run ./setup_service_key.sh first")
    sys.exit(1)

# Read the SQL file
sql_file = Path(__file__).parent / 'sync_schema.sql'
if not sql_file.exists():
    print(f"❌ Error: {sql_file} not found")
    sys.exit(1)

print("=" * 60)
print("🔄 PPN Research Portal - Schema Sync")
print("=" * 60)
print(f"📁 SQL File: {sql_file}")
print(f"🌐 Supabase URL: {SUPABASE_URL}")
print("=" * 60)

try:
    # Create Supabase client
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    # Read SQL content
    with open(sql_file, 'r') as f:
        sql_content = f.read()
    
    print("\n⚠️  Note: Supabase Python client doesn't support raw SQL execution.")
    print("📋 Please run the SQL manually in Supabase Dashboard:\n")
    print("1. Go to: https://supabase.com/dashboard/project/rxwsthatjhnixqsthegf/sql")
    print("2. Open the SQL Editor")
    print("3. Copy and paste the contents of backend/sync_schema.sql")
    print("4. Click 'Run' to execute\n")
    
    # Verify connection by checking if tables exist
    print("🔍 Checking if ghost tables exist...")
    
    try:
        # Try to query the tables
        response = supabase.table("ref_flow_event_types").select("*").limit(1).execute()
        print("✅ ref_flow_event_types exists!")
        
        response = supabase.table("log_patient_flow_events").select("*").limit(1).execute()
        print("✅ log_patient_flow_events exists!")
        
        print("\n🎉 Ghost tables are present! Schema sync already completed.")
        
    except Exception as e:
        error_msg = str(e)
        if "does not exist" in error_msg or "relation" in error_msg:
            print("❌ Ghost tables NOT found")
            print("\n📝 Action Required:")
            print("    Run backend/sync_schema.sql in Supabase SQL Editor")
            print("    URL: https://supabase.com/dashboard/project/rxwsthatjhnixqsthegf/sql")
        else:
            print(f"⚠️  Error checking tables: {error_msg}")
    
    print("\n" + "=" * 60)
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    sys.exit(1)
