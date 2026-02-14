#!/bin/bash
# Work Order Audit Script
# Shows all work orders grouped by status

echo "======================================"
echo "  WORK ORDER AUDIT REPORT"
echo "======================================"
echo ""

WO_DIR=".antigravity/work_orders"

if [ ! -d "$WO_DIR" ]; then
    echo "❌ Work orders directory not found: $WO_DIR"
    exit 1
fi

# Count total work orders
TOTAL=$(ls -1 "$WO_DIR"/WO-*.md 2>/dev/null | wc -l | tr -d ' ')
echo "📊 Total Work Orders: $TOTAL"
echo ""

# Function to list work orders by status
list_by_status() {
    local status=$1
    local display_name=$2
    local emoji=$3
    
    local files=$(grep -l "STATUS: $status" "$WO_DIR"/WO-*.md 2>/dev/null)
    local count=$(echo "$files" | grep -c "WO-" 2>/dev/null || echo "0")
    
    if [ "$count" -gt 0 ]; then
        echo "$emoji $display_name ($count)"
        echo "$files" | while read -r file; do
            if [ -n "$file" ]; then
                basename "$file"
            fi
        done | sed 's/^/  - /'
        echo ""
    fi
}

# List by status
list_by_status "LEAD_PLANNING" "LEAD Planning" "📝"
list_by_status "DESIGNER_PENDING" "Designer Pending" "⏳"
list_by_status "DESIGNER_WORKING" "Designer Working" "🎨"
list_by_status "SOOP_PENDING" "SOOP Pending" "⏳"
list_by_status "SOOP_WORKING" "SOOP Working" "🗄️"
list_by_status "LEAD_REVIEW" "LEAD Review" "🔍"
list_by_status "BUILDER_READY" "Builder Ready" "✅"
list_by_status "BUILDER_WORKING" "Builder Working" "🔨"
list_by_status "COMPLETED_NOTIFY_USER" "Completed (Notify User)" "🎉"
list_by_status "USER_APPROVED" "User Approved" "✅"
list_by_status "ARCHIVED" "Archived" "📦"

# List any work orders without a recognized status
echo "⚠️  Unknown Status"
for file in "$WO_DIR"/WO-*.md; do
    if [ -f "$file" ]; then
        status=$(head -n 1 "$file" | sed 's/STATUS: //')
        case "$status" in
            LEAD_PLANNING|DESIGNER_PENDING|DESIGNER_WORKING|SOOP_PENDING|SOOP_WORKING|LEAD_REVIEW|BUILDER_READY|BUILDER_WORKING|COMPLETED_NOTIFY_USER|USER_APPROVED|ARCHIVED)
                # Known status, skip
                ;;
            *)
                echo "  - $(basename "$file") (Status: $status)"
                ;;
        esac
    fi
done

echo ""
echo "======================================"
echo "Run 'cat .antigravity/work_orders/WO-XXX_*.md' to view a specific work order"
echo "======================================"
