#!/bin/bash
# Helper script to set up Supabase Service Key

echo "=============================================="
echo "🔑 Supabase Service Key Setup"
echo "=============================================="
echo ""
echo "To get your Supabase Service Key:"
echo ""
echo "1. Go to: https://supabase.com/dashboard/project/rxwsthatjhnixqsthegf/settings/api"
echo "2. Scroll to 'Project API keys'"
echo "3. Copy the 'service_role' key (NOT the anon key!)"
echo "4. Paste it below"
echo ""
echo "⚠️  WARNING: Keep this key secret! Never commit it to Git."
echo ""
read -p "Paste your service_role key here: " SERVICE_KEY

if [ -z "$SERVICE_KEY" ]; then
    echo "❌ No key provided. Exiting."
    exit 1
fi

# Update the .env file
cd "$(dirname "$0")"
sed -i.backup "s/SUPABASE_SERVICE_KEY=.*/SUPABASE_SERVICE_KEY=$SERVICE_KEY/" .env
rm -f .env.backup

echo ""
echo "✅ Service key saved to backend/.env"
echo ""
echo "You can now start the backend server with:"
echo "  cd backend && source venv/bin/activate && python main.py"
echo ""
