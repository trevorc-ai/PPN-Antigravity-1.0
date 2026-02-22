
import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

# Load env vars from backend/.env
load_dotenv(dotenv_path='../.env')

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")

if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_SERVICE_KEY not found in .env")
    sys.exit(1)

supabase: Client = create_client(url, key)

email = "info@ppnresearch.com"

print(f"Looking for user with email: {email}...")

# First get user_id from auth.users (via rpc if possible, or just query user_profiles if we can't search auth)
# Since we can't easily search auth.users with public key, we'll try to update user_profiles directly if the email is there.
# But user_profiles has email column!

try:
    # Check if user exists in user_profiles
    response = supabase.table('user_profiles').select("*").eq('email', email).execute()
    
    if len(response.data) == 0:
        print(f"User {email} not found in user_profiles table.")
        # Try to find recent users to see who is there
        recent = supabase.table('user_profiles').select("email, role_tier").limit(5).execute()
        print("Recent users found:", recent.data)
        sys.exit(1)
        
    user = response.data[0]
    print(f"Found user: {user['first_name']} {user['last_name']} ({user['role_tier']})")
    
    if user['role_tier'] == 'super_admin':
        print("User is already super_admin.")
        sys.exit(0)
        
    print("Upgrading to super_admin...")
    update_response = supabase.table('user_profiles').update({'role_tier': 'super_admin'}).eq('email', email).execute()
    
    if update_response.data:
        print("✅ Success! User upgraded to super_admin.")
        print(update_response.data[0])
    else:
        print("❌ Update failed.")
        
except Exception as e:
    print(f"Error: {e}")
