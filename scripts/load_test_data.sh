#!/bin/bash
# Load test data into Supabase database
# This script loads comprehensive test data for visualization testing

echo "🔄 Loading test data into database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable not set"
    echo "Please set it in your .env file or export it"
    exit 1
fi

# Execute the test data migration
echo "📊 Executing migration 024: Comprehensive Test Data"
psql "$DATABASE_URL" -f migrations/024_load_comprehensive_test_data.sql

if [ $? -eq 0 ]; then
    echo "✅ Test data loaded successfully!"
    echo ""
    echo "📋 Test Data Summary:"
    echo "   - 10 longitudinal patients (multiple sessions)"
    echo "   - 20 single-session patients"
    echo "   - Mix of all substances and outcomes"
    echo ""
    echo "🔑 Test Login Credentials:"
    echo "   Email: demo@ppn-research.local"
    echo "   Password: DemoPassword123!"
    echo ""
    echo "🎯 Next Steps:"
    echo "   1. Log in with test credentials"
    echo "   2. Navigate to Analytics to see populated charts"
    echo "   3. Try Protocol Builder to see Clinical Insights"
else
    echo "❌ Failed to load test data"
    echo "Check the error messages above"
    exit 1
fi
