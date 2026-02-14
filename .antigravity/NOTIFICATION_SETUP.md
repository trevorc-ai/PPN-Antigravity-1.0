# Work Order Notification System

**Purpose:** Automatically notify you when work orders are ready for review  
**Status:** Ready to start

---

## 🚀 Quick Start

### Start the notification watcher:
```bash
cd /Users/trevorcalton/Desktop/PPN-Antigravity-1.0
nohup .antigravity/scripts/watch_notifications.sh > .antigravity/watcher.log 2>&1 &
```

### Stop the watcher:
```bash
pkill -f watch_notifications.sh
```

### Check notification log:
```bash
tail -f .antigravity/notifications.log
```

---

## 📬 What You'll Get Notified About

**Automatic notifications for:**
- ✅ `LEAD_REVIEW` - Work ready for your review
- ✅ `BUILDER_READY` - Work approved, ready for implementation
- ✅ `COMPLETED_NOTIFY_USER` - Work completed, ready for final review
- ✅ `DESIGNER_PENDING` - Work assigned to DESIGNER
- ✅ `SOOP_PENDING` - Work assigned to SOOP
- ✅ `MARKETER_PENDING` - Work assigned to MARKETER

**Example notification:**
> **Work Order Ready**  
> WO-001 ready for LEAD review

---

## 🔧 How It Works

1. **File Watcher:** Monitors `.antigravity/work_orders/*.md` for changes
2. **Status Detection:** Reads `STATUS:` line from each work order
3. **Smart Filtering:** Only notifies once per status change (no spam)
4. **Notification Log:** Tracks all notifications in `.antigravity/notifications.log`

---

## 📊 Current Work Order Status

Run this to see all pending work:
```bash
bash .antigravity/work_orders/audit_work_orders.sh
```

---

## ⚙️ Installation (One-Time Setup)

### Option 1: Manual Start (Recommended for Testing)
```bash
# Start watcher in background
cd /Users/trevorcalton/Desktop/PPN-Antigravity-1.0
nohup .antigravity/scripts/watch_notifications.sh > .antigravity/watcher.log 2>&1 &

# Verify it's running
ps aux | grep watch_notifications
```

### Option 2: Auto-Start on Login (LaunchAgent)
Create: `~/Library/LaunchAgents/com.ppn.workorder.watcher.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ppn.workorder.watcher</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/.antigravity/scripts/watch_notifications.sh</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/Users/trevorcalton/Desktop/PPN-Antigravity-1.0</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/.antigravity/watcher.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/.antigravity/watcher.log</string>
</dict>
</plist>
```

Load it:
```bash
launchctl load ~/Library/LaunchAgents/com.ppn.workorder.watcher.plist
```

---

## 🧪 Test It

1. **Start the watcher:**
   ```bash
   nohup .antigravity/scripts/watch_notifications.sh > .antigravity/watcher.log 2>&1 &
   ```

2. **Trigger a test notification:**
   ```bash
   # Manually change a work order status
   echo "STATUS: LEAD_REVIEW" > .antigravity/work_orders/WO-TEST.md
   ```

3. **You should see a notification pop up!**

4. **Clean up test:**
   ```bash
   rm .antigravity/work_orders/WO-TEST.md
   ```

---

## 📝 Notification Log Format

```
[2026-02-14 00:45:00] Work Order Ready: WO-001 ready for LEAD review
[2026-02-14 00:50:00] Work Order Approved: WO-001 approved - ready for BUILDER
[2026-02-14 01:00:00] Work Order Complete: WO-001 completed - ready for user review
```

---

## ✅ Next Steps

1. **Start the watcher** (one command)
2. **Test with existing work orders**
3. **Let agents work** - you'll get notified automatically
4. **Review when ready** - click notification to see details

**No more asking for work!** You'll be notified the moment it's ready.
