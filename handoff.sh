#!/bin/bash
# Usage: ./handoff.sh [TICKET_FILE] [NEXT_FOLDER] [NEXT_AGENT]
TICKET=$1
DESTINATION=$2
AGENT=$3

# 1. Move the file
mv "$TICKET" "_WORK_ORDERS/$DESTINATION/"

# 2. Extract just the filename for logging
FILENAME=$(basename "$TICKET")

# 3. Automatically update the CEO's Status File
echo "- ✅ [SYSTEM AUTO-LOG]: $FILENAME moved to $DESTINATION. Awaiting $AGENT." >> _agent_status.md

# 4. Output success to the Agent's terminal
echo "[STATUS: PASS] HANDOFF SUCCESSFUL. Ticket routed to $AGENT. Yielding terminal."