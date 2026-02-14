#!/bin/bash

# Inbox Notification System for Work Orders
# Watches for work order status changes and sends notifications

WORK_ORDER_DIR=".antigravity/work_orders"
NOTIFICATION_LOG=".antigravity/notifications.log"

# Create notification log if it doesn't exist
touch "$NOTIFICATION_LOG"

# Function to send macOS notification
send_notification() {
  local title="$1"
  local message="$2"
  local wo_file="$3"
  
  # Log notification
  echo "[$(date)] $title: $message" >> "$NOTIFICATION_LOG"
  
  # Send macOS notification
  osascript -e "display notification \"$message\" with title \"$title\" sound name \"Glass\""
  
  # Optional: Open work order file
  # open "$wo_file"
}

# Function to check work order status
check_work_orders() {
  # Check for LEAD_REVIEW status
  for file in "$WORK_ORDER_DIR"/WO-*.md; do
    if [ -f "$file" ]; then
      STATUS=$(grep -m 1 "^STATUS:" "$file" | cut -d' ' -f2)
      WO_NUM=$(basename "$file" | cut -d'_' -f1)
      
      # Check if we've already notified about this status
      if ! grep -q "$WO_NUM:$STATUS" "$NOTIFICATION_LOG"; then
        case $STATUS in
          "LEAD_REVIEW")
            send_notification "Work Order Ready" "$WO_NUM ready for LEAD review" "$file"
            ;;
          "BUILDER_READY")
            send_notification "Work Order Approved" "$WO_NUM approved - ready for BUILDER" "$file"
            ;;
          "COMPLETED_NOTIFY_USER")
            send_notification "Work Order Complete" "$WO_NUM completed - ready for user review" "$file"
            ;;
          "DESIGNER_PENDING"|"SOOP_PENDING"|"MARKETER_PENDING")
            AGENT=$(echo $STATUS | cut -d'_' -f1)
            send_notification "Work Order Assigned" "$WO_NUM assigned to $AGENT" "$file"
            ;;
        esac
      fi
    fi
  done
}

# Watch for file changes
if command -v fswatch &> /dev/null; then
  echo "Starting work order watcher with fswatch..."
  fswatch -0 "$WORK_ORDER_DIR"/*.md | while read -d "" event; do
    check_work_orders
  done
else
  # Fallback: Poll every 30 seconds
  echo "fswatch not found. Using polling mode (30s interval)..."
  while true; do
    check_work_orders
    sleep 30
  done
fi
