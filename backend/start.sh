#!/bin/bash
# Quick start script for PPN Research Portal Backend

echo "=================================================="
echo "🚀 PPN Research Portal - Backend Quick Start"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "main.py" ]; then
    echo "❌ Error: Please run this script from the backend/ directory"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env
    echo "✅ Created .env - Please edit it with your Supabase credentials"
    echo ""
    echo "You need to set:"
    echo "  - SUPABASE_URL"
    echo "  - SUPABASE_SERVICE_KEY"
    echo ""
    read -p "Press Enter after updating .env..."
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "=================================================="
echo "✅ Setup complete! Starting backend server..."
echo "=================================================="
echo ""
echo "📚 API Documentation will be available at:"
echo "   http://localhost:8000/api/docs"
echo ""
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the server
python main.py
