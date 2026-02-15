#!/bin/bash
# INSPECTOR Migration Validator
# Automatically checks SQL migrations for database integrity violations

set -e

MIGRATION_FILE="$1"

if [ -z "$MIGRATION_FILE" ]; then
  echo "❌ Usage: ./validate-migration.sh <migration_file.sql>"
  exit 1
fi

if [ ! -f "$MIGRATION_FILE" ]; then
  echo "❌ File not found: $MIGRATION_FILE"
  exit 1
fi

echo "🔍 INSPECTOR: Validating migration file: $MIGRATION_FILE"
echo ""

VIOLATIONS=0

# Check 1: No INSERT into log_ tables
echo "📋 Check 1: Scanning for INSERT INTO log_ violations..."
if grep -i "INSERT INTO log_" "$MIGRATION_FILE"; then
  echo "❌ VIOLATION: Found INSERT INTO log_ statement"
  echo "   Log tables must NEVER be seeded with data"
  echo "   Only ref_ tables can be seeded"
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo "✅ PASS: No INSERT INTO log_ statements found"
fi
echo ""

# Check 2: No DROP commands (additive-only)
echo "📋 Check 2: Scanning for DROP commands..."
if grep -iE "DROP (TABLE|COLUMN|TYPE)" "$MIGRATION_FILE"; then
  echo "❌ VIOLATION: Found DROP command"
  echo "   Migrations must be additive-only"
  echo "   Use ALTER TABLE ADD instead"
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo "✅ PASS: No DROP commands found"
fi
echo ""

# Check 3: No ALTER TYPE commands
echo "📋 Check 3: Scanning for ALTER TYPE commands..."
if grep -i "ALTER TYPE" "$MIGRATION_FILE"; then
  echo "❌ VIOLATION: Found ALTER TYPE command"
  echo "   Cannot modify existing types"
  echo "   Create new types instead"
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo "✅ PASS: No ALTER TYPE commands found"
fi
echo ""

# Check 4: RLS enabled on all new tables
echo "📋 Check 4: Checking RLS policies..."
TABLE_COUNT=$(grep -ci "CREATE TABLE" "$MIGRATION_FILE" || echo "0")
RLS_COUNT=$(grep -ci "ENABLE ROW LEVEL SECURITY" "$MIGRATION_FILE" || echo "0")

if [ "$TABLE_COUNT" -gt 0 ] && [ "$RLS_COUNT" -lt "$TABLE_COUNT" ]; then
  echo "⚠️  WARNING: Found $TABLE_COUNT tables but only $RLS_COUNT RLS statements"
  echo "   All tables should have RLS enabled"
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo "✅ PASS: RLS policies match table count ($TABLE_COUNT tables, $RLS_COUNT RLS)"
fi
echo ""

# Check 5: No free-text columns in log tables
echo "📋 Check 5: Scanning for TEXT/VARCHAR in log tables..."
if grep -A 10 "CREATE TABLE log_" "$MIGRATION_FILE" | grep -iE "(TEXT|VARCHAR)" | grep -v "-- "; then
  echo "⚠️  WARNING: Found TEXT/VARCHAR columns in log tables"
  echo "   Log tables should use controlled values (IDs, booleans, numerics)"
  echo "   Free-text fields risk PHI/PII violations"
  # This is a warning, not a hard violation
else
  echo "✅ PASS: No problematic TEXT/VARCHAR columns in log tables"
fi
echo ""

# Final verdict
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $VIOLATIONS -eq 0 ]; then
  echo "✅ INSPECTOR VERDICT: APPROVED"
  echo "   Migration passed all validation checks"
  echo "   Safe for deployment"
  exit 0
else
  echo "❌ INSPECTOR VERDICT: REJECTED"
  echo "   Found $VIOLATIONS violation(s)"
  echo "   Migration must be corrected before deployment"
  echo ""
  echo "📖 Required reading for SOOP:"
  echo "   .agent/handoffs/CRITICAL_SOOP_DATABASE_VIOLATIONS.md"
  echo "   .agent/workflows/database-integrity-policy.md"
  exit 1
fi
