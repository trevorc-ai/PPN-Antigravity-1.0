#!/bin/bash

# ============================================================================
# PPN RESEARCH PORTAL - FULL BACKUP SCRIPT
# ============================================================================
# Purpose: Create a complete backup of the project to local drive
# Date: 2026-02-10
# Usage: ./backup.sh
# ============================================================================

# Configuration
BACKUP_DIR="$HOME/Desktop/PPN-Backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_NAME="PPN-Backup_${TIMESTAMP}"
PROJECT_DIR="/Users/trevorcalton/Documents/GitHub/PPN-Antigravity-1.0"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "============================================================================"
echo "🔐 PPN RESEARCH PORTAL - FULL BACKUP"
echo "============================================================================"
echo ""
echo "📂 Source: ${PROJECT_DIR}"
echo "💾 Destination: ${BACKUP_DIR}/${BACKUP_NAME}"
echo "⏰ Timestamp: ${TIMESTAMP}"
echo ""

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

# Create timestamped backup folder
FULL_BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"
mkdir -p "${FULL_BACKUP_PATH}"

echo "============================================================================"
echo "📦 STEP 1: Copying Project Files"
echo "============================================================================"

# Copy entire project (excluding node_modules and .git)
rsync -av \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'dist' \
  --exclude 'build' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  "${PROJECT_DIR}/" "${FULL_BACKUP_PATH}/project/"

echo -e "${GREEN}✅ Project files copied${NC}"
echo ""

echo "============================================================================"
echo "📦 STEP 2: Creating Archive"
echo "============================================================================"

# Create compressed archive
cd "${BACKUP_DIR}"
tar -czf "${BACKUP_NAME}.tar.gz" "${BACKUP_NAME}"

ARCHIVE_SIZE=$(du -h "${BACKUP_NAME}.tar.gz" | cut -f1)
echo -e "${GREEN}✅ Archive created: ${BACKUP_NAME}.tar.gz (${ARCHIVE_SIZE})${NC}"
echo ""

echo "============================================================================"
echo "📦 STEP 3: Creating Backup Manifest"
echo "============================================================================"

# Create manifest file
MANIFEST_FILE="${FULL_BACKUP_PATH}/BACKUP_MANIFEST.txt"

cat > "${MANIFEST_FILE}" << EOF
============================================================================
PPN RESEARCH PORTAL - BACKUP MANIFEST
============================================================================

Backup Date: ${TIMESTAMP}
Source: ${PROJECT_DIR}
Destination: ${FULL_BACKUP_PATH}

============================================================================
CONTENTS
============================================================================

$(tree -L 2 "${FULL_BACKUP_PATH}/project" 2>/dev/null || find "${FULL_BACKUP_PATH}/project" -maxdepth 2 -type d)

============================================================================
FILE COUNTS
============================================================================

Total Files: $(find "${FULL_BACKUP_PATH}/project" -type f | wc -l)
Total Directories: $(find "${FULL_BACKUP_PATH}/project" -type d | wc -l)

Source Code:
- TypeScript/TSX: $(find "${FULL_BACKUP_PATH}/project" -name "*.tsx" -o -name "*.ts" | wc -l)
- JavaScript: $(find "${FULL_BACKUP_PATH}/project" -name "*.js" -o -name "*.jsx" | wc -l)
- CSS: $(find "${FULL_BACKUP_PATH}/project" -name "*.css" | wc -l)
- SQL: $(find "${FULL_BACKUP_PATH}/project" -name "*.sql" | wc -l)
- Markdown: $(find "${FULL_BACKUP_PATH}/project" -name "*.md" | wc -l)

============================================================================
BACKUP INTEGRITY
============================================================================

Archive: ${BACKUP_NAME}.tar.gz
Size: ${ARCHIVE_SIZE}
Checksum: $(shasum -a 256 "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" | cut -d' ' -f1)

============================================================================
RESTORE INSTRUCTIONS
============================================================================

To restore this backup:

1. Extract archive:
   tar -xzf ${BACKUP_NAME}.tar.gz

2. Navigate to project:
   cd ${BACKUP_NAME}/project

3. Install dependencies:
   npm install

4. Copy environment variables:
   cp .env.example .env
   # Edit .env with your Supabase credentials

5. Start development server:
   npm run dev

============================================================================
EOF

echo -e "${GREEN}✅ Manifest created${NC}"
echo ""

echo "============================================================================"
echo "📦 STEP 4: Backup Summary"
echo "============================================================================"

echo ""
echo "📊 BACKUP STATISTICS:"
echo "-------------------"
echo "Total Files: $(find "${FULL_BACKUP_PATH}/project" -type f | wc -l)"
echo "Total Size (uncompressed): $(du -sh "${FULL_BACKUP_PATH}" | cut -f1)"
echo "Archive Size: ${ARCHIVE_SIZE}"
echo ""
echo "📁 BACKUP LOCATIONS:"
echo "-------------------"
echo "Folder: ${FULL_BACKUP_PATH}"
echo "Archive: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
echo ""
echo "🔐 CHECKSUM:"
echo "-------------------"
shasum -a 256 "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
echo ""

echo "============================================================================"
echo -e "${GREEN}✅ BACKUP COMPLETE!${NC}"
echo "============================================================================"
echo ""
echo "💡 TIP: You can delete the uncompressed folder if you want to save space:"
echo "   rm -rf ${FULL_BACKUP_PATH}"
echo ""
echo "💡 To restore, run:"
echo "   cd ${BACKUP_DIR}"
echo "   tar -xzf ${BACKUP_NAME}.tar.gz"
echo ""
