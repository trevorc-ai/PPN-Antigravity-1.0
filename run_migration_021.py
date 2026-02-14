#!/usr/bin/env python3
"""
Run migration 021_add_common_medications_flag.sql
"""
import os
from pathlib import Path
from dotenv import load_dotenv
import psycopg2

# Load environment variables
env_path = Path(__file__).parent / '.env.local'
load_dotenv(env_path)

# Get database connection string from environment
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL", "").replace("https://", "").replace(".supabase.co", "")
DB_PASSWORD = os.getenv("SUPABASE_DB_PASSWORD")

if not DB_PASSWORD:
    print("❌ Error: SUPABASE_DB_PASSWORD not set in .env.local")
    print("Please add: SUPABASE_DB_PASSWORD=your_password")
    exit(1)

# Connection string
conn_string = f"postgresql://postgres.{SUPABASE_URL}:{DB_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

# Read migration file
migration_file = Path(__file__).parent / 'migrations' / '021_add_common_medications_flag.sql'
with open(migration_file, 'r') as f:
    sql = f.read()

print("=" * 60)
print("🔄 Running Migration: 021_add_common_medications_flag.sql")
print("=" * 60)

try:
    conn = psycopg2.connect(conn_string)
    cursor = conn.cursor()
    
    # Execute migration
    cursor.execute(sql)
    conn.commit()
    
    # Verify results
    cursor.execute("SELECT medication_name FROM public.ref_medications WHERE is_common = true ORDER BY medication_name")
    results = cursor.fetchall()
    
    print(f"\n✅ Migration successful!")
    print(f"\n📋 {len(results)} medications marked as common:")
    for row in results:
        print(f"   • {row[0]}")
    
    cursor.close()
    conn.close()
    
    print("\n" + "=" * 60)
    print("✅ Complete!")
    print("=" * 60)
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    exit(1)
