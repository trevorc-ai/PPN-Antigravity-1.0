# Work Orders System

## Quick Start

### For LEAD
```bash
# Create a new work order
WO_NUM=$(cat .antigravity/work_orders/COUNTER.txt)
cp .antigravity/work_orders/TEMPLATE_WORK_ORDER.md .antigravity/work_orders/WO-$(printf "%03d" $WO_NUM)_Feature_Name.md
echo $((WO_NUM + 1)) > .antigravity/work_orders/COUNTER.txt
```

### For All Agents (Startup Checklist)
```bash
# 1. Read the protocol
cat .antigravity/work_orders/PROTOCOL.md

# 2. Check for your pending tickets
grep -l "STATUS: DESIGNER_PENDING" .antigravity/work_orders/WO-*.md
grep -l "STATUS: SOOP_PENDING" .antigravity/work_orders/WO-*.md
grep -l "STATUS: BUILDER_READY" .antigravity/work_orders/WO-*.md

# 3. List all active work orders
ls -lt .antigravity/work_orders/WO-*.md | head -10
```

### Work Order Audit (Check All Statuses)
```bash
# See audit_work_orders.sh
bash .antigravity/work_orders/audit_work_orders.sh
```

## File Structure

```
.antigravity/work_orders/
├── PROTOCOL.md              # Universal protocol (mandatory reading)
├── TEMPLATE_WORK_ORDER.md   # Template for new tickets
├── COUNTER.txt              # Next WO number
├── README.md                # This file
├── audit_work_orders.sh     # Audit script
└── WO-XXX_Feature_Name.md   # Individual work orders
```

## Status Flow

```
LEAD_PLANNING
    ↓
DESIGNER_PENDING → DESIGNER_WORKING → LEAD_REVIEW
    ↓                                      ↓
SOOP_PENDING → SOOP_WORKING ──────────────┘
    ↓
BUILDER_READY → BUILDER_WORKING → COMPLETED_NOTIFY_USER
    ↓
USER_APPROVED → ARCHIVED
```

## Rules

1. ✅ **Read PROTOCOL.md on every session start**
2. ✅ **Check for your pending tickets**
3. ✅ **Update status when you start working**
4. ✅ **Document everything in the ticket**
5. ✅ **No verbal handoffs**

## Common Commands

```bash
# Find all pending work orders
grep -r "STATUS:.*PENDING" .antigravity/work_orders/

# Find completed work orders
grep -l "STATUS: COMPLETED_NOTIFY_USER" .antigravity/work_orders/WO-*.md

# Archive completed work orders
mkdir -p .antigravity/work_orders/archive
mv .antigravity/work_orders/WO-XXX_*.md .antigravity/work_orders/archive/
```

## Help

See `PROTOCOL.md` for detailed workflow and troubleshooting.
