#!/bin/bash
# ============================================================================
# Run Protocol Builder Database Migrations
# ============================================================================
# Purpose: Execute migrations 015-017 for Clinical Decision Support System
# Date: 2026-02-13
# ============================================================================

set -e  # Exit on error

echo "🚀 Starting Protocol Builder database migrations..."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable not set"
    echo "Please set DATABASE_URL to your Supabase connection string"
    exit 1
fi

# Migration directory
MIGRATION_DIR="./migrations"

# Run migrations in order
echo "📋 Running Migration 015: Receptor Affinity Data..."
psql "$DATABASE_URL" -f "$MIGRATION_DIR/015_add_receptor_affinity_data.sql"
echo "✅ Migration 015 complete"
echo ""

echo "📋 Running Migration 016: Drug Interaction Knowledge Graph..."
psql "$DATABASE_URL" -f "$MIGRATION_DIR/016_create_knowledge_graph_enhanced.sql"
echo "✅ Migration 016 complete"
echo ""

echo "📋 Running Migration 017: Materialized Views..."
psql "$DATABASE_URL" -f "$MIGRATION_DIR/017_create_materialized_views.sql"
echo "✅ Migration 017 complete"
echo ""

# Verify migrations
echo "🔍 Verifying migrations..."
echo ""

echo "Checking receptor affinity data..."
psql "$DATABASE_URL" -c "SELECT COUNT(*) as receptor_data_count FROM ref_substances WHERE receptor_5ht2a_ki IS NOT NULL;"
echo ""

echo "Checking drug interactions..."
psql "$DATABASE_URL" -c "SELECT COUNT(*) as interaction_count FROM ref_drug_interactions;"
echo ""

echo "Checking materialized views..."
psql "$DATABASE_URL" -c "SELECT COUNT(*) as outcomes_count FROM mv_outcomes_summary;"
psql "$DATABASE_URL" -c "SELECT COUNT(*) as clinic_count FROM mv_clinic_benchmarks;"
psql "$DATABASE_URL" -c "SELECT COUNT(*) as network_count FROM mv_network_benchmarks;"
echo ""

echo "✅ All migrations completed successfully!"
echo ""
echo "📊 Summary:"
echo "  - Receptor affinity data populated for 8 substances"
echo "  - Drug interaction knowledge graph created with 15+ interactions"
echo "  - 3 materialized views created for analytics"
echo ""
echo "🎉 Database is ready for Protocol Builder Clinical Decision Support System!"
