# 📱 MOBILE-FIRST OPTIMIZATION STRATEGY
## PPN Research Portal - High Mobile Usage Preparation

**Created By:** LEAD  
**Date:** 2026-02-12 02:37 PST  
**Priority:** CRITICAL  
**Context:** Anticipating high mobile usage from practitioners

---

## 📊 EXECUTIVE SUMMARY

**Assumption:** 60-70% of practitioners will use PPN on mobile devices

**Why Mobile Matters:**
- Practitioners log protocols immediately after sessions (on the go)
- Safety alerts need to be checked between patients
- Dashboard reviews happen during commutes
- Compliance reports are often exported from mobile

**Current State:** 🟡 Mobile works, but not optimized  
**Target State:** 🟢 Mobile-first, desktop-enhanced

---

## 🎯 MOBILE USE CASES

### **Use Case 1: Log Protocol After Session**
**Scenario:** Practitioner just finished a ketamine session, patient is in recovery room

**Mobile Workflow:**
1. Pull out phone
2. Open PPN app (PWA)
3. Tap "Log Protocol" (large button)
4. Fill form (dropdowns, not typing)
5. Submit (auto-save, no data loss)
6. See confirmation toast
7. Put phone away

**Time:** 2-3 minutes  
**Friction Points:**
- Small tap targets (buttons < 44px)
- Typing on mobile keyboard (slow)
- Form doesn't fit on screen (scrolling)
- No offline support (session drops)

---

### **Use Case 2: Check Safety Alerts**
**Scenario:** Practitioner between patients, 5-minute break

**Mobile Workflow:**
1. Pull out phone
2. Open PPN app
3. See badge: "Safety (3)"
4. Tap Safety Surveillance
5. Review 3 alerts
6. Dismiss or flag for follow-up
7. Put phone away

**Time:** 1-2 minutes  
**Friction Points:**
- Alerts not visible on home screen
- Small text (hard to read)
- No push notifications
- Slow page load (loses attention)

---

### **Use Case 3: Review Dashboard During Commute**
**Scenario:** Practitioner on train, 20-minute commute

**Mobile Workflow:**
1. Pull out phone
2. Open PPN app
3. Review Dashboard (safety score, protocols, trends)
4. Tap Analytics for deeper dive
5. Review charts (pinch to zoom)
6. Export PDF report
7. Put phone away

**Time:** 5-10 minutes  
**Friction Points:**
- Charts don't resize for mobile
- Pinch-to-zoom is clunky
- PDF export doesn't work on mobile
- Data tables overflow screen

---

## 📐 MOBILE DESIGN PRINCIPLES

### **1. Touch-First Interaction**
**Rule:** All interactive elements ≥ 44px × 44px (Apple HIG standard)

**Current Issues:**
- Buttons: 36px (too small)
- Dropdowns: 40px (borderline)
- Checkboxes: 16px (way too small)

**Fix:**
```css
/* Mobile-first button sizing */
.button {
  min-height: 48px; /* 44px + 4px padding */
  min-width: 48px;
  padding: 12px 24px;
  font-size: 16px; /* Prevents iOS zoom on focus */
}

/* Mobile-first form inputs */
.input, .select {
  min-height: 48px;
  font-size: 16px; /* Prevents iOS zoom */
  padding: 12px 16px;
}

/* Mobile-first checkboxes/radios */
.checkbox, .radio {
  width: 24px;
  height: 24px;
  /* Increase tap target with padding */
  padding: 12px;
}
```

---

### **2. Thumb-Friendly Navigation**
**Rule:** Primary actions in bottom 1/3 of screen (thumb zone)

**Current Issues:**
- Primary CTA ("Log Protocol") is top-right (hard to reach)
- Navigation is top (requires two hands)
- Submit buttons are bottom (good) but too small

**Fix:**
```tsx
// Mobile-first bottom navigation
<BottomNav>
  <NavItem icon="home" label="Dashboard" />
  <NavItem icon="plus" label="Log" primary /> {/* Center, largest */}
  <NavItem icon="shield" label="Safety" badge={3} />
  <NavItem icon="chart" label="Analytics" />
  <NavItem icon="menu" label="More" />
</BottomNav>

// Floating Action Button (FAB) for primary action
<FAB 
  position="bottom-right" 
  icon="plus" 
  label="Log Protocol"
  onClick={openProtocolBuilder}
/>
```

---

### **3. Content Prioritization**
**Rule:** Show most important content first, progressive disclosure

**Current Issues:**
- Dashboard shows everything (overwhelming on mobile)
- Charts are full-width (don't fit on mobile)
- Tables have 10+ columns (horizontal scroll)

**Fix:**
```tsx
// Mobile-first Dashboard layout
<MobileDashboard>
  {/* Priority 1: Action items */}
  <Section>
    <h2>Action Items</h2>
    <Alert severity="high">3 safety alerts need review</Alert>
    <Button>Review Alerts</Button>
  </Section>

  {/* Priority 2: Key metrics */}
  <Section>
    <h2>Your Performance</h2>
    <MetricCard>
      <Label>Safety Score</Label>
      <Value>92/100</Value>
      <Trend>+5 from last month</Trend>
    </MetricCard>
  </Section>

  {/* Priority 3: Recent activity */}
  <Section>
    <h2>Recent Protocols</h2>
    <ProtocolList limit={5} />
    <Button variant="ghost">View All</Button>
  </Section>

  {/* Priority 4: Charts (collapsed by default) */}
  <Accordion>
    <AccordionItem title="Safety Trend">
      <Chart type="line" data={safetyTrend} />
    </AccordionItem>
  </Accordion>
</MobileDashboard>
```

---

### **4. Offline-First Architecture**
**Rule:** App works offline, syncs when online

**Current Issues:**
- No offline support (requires internet)
- Form data lost if connection drops
- No indication of sync status

**Fix:**
```tsx
// Service Worker for offline support
// src/sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('ppn-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/dashboard',
        '/protocol-builder',
        '/safety-surveillance',
        '/analytics',
        '/offline.html'
      ]);
    })
  );
});

// IndexedDB for offline data storage
import { openDB } from 'idb';

const db = await openDB('ppn-offline', 1, {
  upgrade(db) {
    db.createObjectStore('protocols', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('sync-queue', { keyPath: 'id', autoIncrement: true });
  }
});

// Save protocol offline
async function saveProtocolOffline(protocol) {
  await db.add('protocols', { ...protocol, synced: false });
  await db.add('sync-queue', { type: 'protocol', data: protocol });
  showToast('Protocol saved offline. Will sync when online.');
}

// Sync when online
window.addEventListener('online', async () => {
  const queue = await db.getAll('sync-queue');
  for (const item of queue) {
    await syncToServer(item);
    await db.delete('sync-queue', item.id);
  }
  showToast('All data synced!');
});
```

---

### **5. Performance Optimization**
**Rule:** First Contentful Paint < 1.5s on 3G

**Current Issues:**
- Large bundle size (2MB+)
- No code splitting
- Images not optimized
- No lazy loading

**Fix:**
```tsx
// Code splitting by route
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProtocolBuilder = lazy(() => import('./pages/ProtocolBuilder'));
const Analytics = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/protocol-builder" element={<ProtocolBuilder />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}

// Image optimization
<img 
  src="/images/molecule.webp" 
  srcSet="/images/molecule-320w.webp 320w,
          /images/molecule-640w.webp 640w,
          /images/molecule-1280w.webp 1280w"
  sizes="(max-width: 640px) 320px,
         (max-width: 1280px) 640px,
         1280px"
  loading="lazy"
  alt="Psilocybin molecule"
/>

// Lazy load charts
import { lazy } from 'react';
const Chart = lazy(() => import('./components/Chart'));

<Suspense fallback={<ChartSkeleton />}>
  <Chart data={safetyTrend} />
</Suspense>
```

---

## 📱 PROGRESSIVE WEB APP (PWA)

### **Why PWA?**
- Install to home screen (no app store)
- Offline support (service worker)
- Push notifications (safety alerts)
- Fast loading (cached assets)
- Native feel (full screen, no browser chrome)

### **Implementation:**

**1. Web App Manifest** (`public/manifest.json`)
```json
{
  "name": "PPN Research Portal",
  "short_name": "PPN",
  "description": "Clinical Intelligence Platform for Psychedelic Therapy",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#6366f1",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["medical", "productivity"],
  "screenshots": [
    {
      "src": "/screenshots/dashboard-mobile.png",
      "sizes": "750x1334",
      "type": "image/png"
    }
  ]
}
```

**2. Service Worker Registration** (`src/index.tsx`)
```tsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}
```

**3. Push Notifications** (Safety Alerts)
```tsx
// Request permission
async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: VAPID_PUBLIC_KEY
    });
    // Send subscription to server
    await saveSubscription(subscription);
  }
}

// Show notification
self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    tag: 'safety-alert',
    requireInteraction: true,
    actions: [
      { action: 'view', title: 'View Alert' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  });
});
```

---

## 🎨 MOBILE UI COMPONENTS

### **Component 1: Mobile Protocol Builder**

**Design:**
- One field per screen (wizard style)
- Large tap targets (48px min)
- Auto-advance on selection
- Progress indicator at top
- Swipe to go back

```tsx
<MobileProtocolBuilder>
  {/* Progress */}
  <ProgressBar current={3} total={8} />
  
  {/* Step 3: Substance */}
  <Step>
    <h2>What substance?</h2>
    <ButtonGroup vertical>
      <Button size="large" onClick={() => selectSubstance('psilocybin')}>
        Psilocybin
      </Button>
      <Button size="large" onClick={() => selectSubstance('ketamine')}>
        Ketamine
      </Button>
      <Button size="large" onClick={() => selectSubstance('mdma')}>
        MDMA
      </Button>
    </ButtonGroup>
  </Step>
  
  {/* Navigation */}
  <BottomNav>
    <Button variant="ghost" onClick={goBack}>Back</Button>
    <Button variant="primary" onClick={goNext}>Next</Button>
  </BottomNav>
</MobileProtocolBuilder>
```

---

### **Component 2: Mobile Dashboard Cards**

**Design:**
- Swipeable cards (horizontal scroll)
- Tap to expand
- Pull to refresh
- Skeleton loading

```tsx
<MobileDashboard>
  {/* Pull to refresh */}
  <PullToRefresh onRefresh={refreshData}>
    
    {/* Swipeable cards */}
    <CardCarousel>
      <MetricCard>
        <Icon name="shield" color="green" />
        <Label>Safety Score</Label>
        <Value>92/100</Value>
        <Trend>+5 from last month</Trend>
        <Button size="small">View Details</Button>
      </MetricCard>
      
      <MetricCard>
        <Icon name="clock" color="blue" />
        <Label>Time Saved</Label>
        <Value>12 hours</Value>
        <Trend>This month</Trend>
        <Button size="small">View Breakdown</Button>
      </MetricCard>
      
      <MetricCard>
        <Icon name="alert" color="red" />
        <Label>Safety Alerts</Label>
        <Value>3 active</Value>
        <Trend>Needs review</Trend>
        <Button size="small">Review Now</Button>
      </MetricCard>
    </CardCarousel>
    
  </PullToRefresh>
</MobileDashboard>
```

---

### **Component 3: Mobile Charts**

**Design:**
- Simplified (fewer data points)
- Horizontal scroll for time series
- Tap to see tooltip
- Export as image (not PDF)

```tsx
<MobileChart>
  {/* Simplified chart */}
  <ResponsiveContainer width="100%" height={200}>
    <LineChart data={last6Months}> {/* Not 12 months */}
      <Line 
        type="monotone" 
        dataKey="safetyScore" 
        stroke="#6366f1"
        strokeWidth={3} {/* Thicker for mobile */}
        dot={{ r: 6 }} {/* Larger dots for tap targets */}
      />
      <XAxis 
        dataKey="month" 
        tick={{ fontSize: 12 }}
        interval={0} {/* Show all labels */}
      />
      <YAxis 
        tick={{ fontSize: 12 }}
        domain={[0, 100]}
      />
      <Tooltip 
        contentStyle={{ fontSize: 14 }}
        cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
      />
    </LineChart>
  </ResponsiveContainer>
  
  {/* Export */}
  <Button size="small" onClick={exportAsImage}>
    <Icon name="download" /> Save Image
  </Button>
</MobileChart>
```

---

## 📊 MOBILE-SPECIFIC FEATURES

### **Feature 1: Voice Input**
**Use Case:** Log protocol hands-free while driving

```tsx
import { useSpeechRecognition } from 'react-speech-recognition';

function VoiceProtocolBuilder() {
  const { transcript, listening, startListening, stopListening } = useSpeechRecognition();
  
  return (
    <div>
      <Button 
        onMouseDown={startListening} 
        onMouseUp={stopListening}
        size="large"
      >
        {listening ? '🎤 Listening...' : '🎤 Tap to Speak'}
      </Button>
      
      <p>You said: {transcript}</p>
      
      {/* Parse transcript */}
      <ParsedProtocol>
        Substance: {extractSubstance(transcript)}
        Dose: {extractDose(transcript)}
        Route: {extractRoute(transcript)}
      </ParsedProtocol>
    </div>
  );
}
```

---

### **Feature 2: Camera Scan**
**Use Case:** Scan medication label to auto-fill dose

```tsx
import { BarcodeScanner } from 'react-barcode-scanner';

function CameraScan() {
  const handleScan = (data) => {
    // Parse barcode data
    const medication = parseMedicationBarcode(data);
    
    // Auto-fill form
    setFormData({
      substance_id: medication.substance_id,
      dose_mg: medication.dose_mg,
      route_id: medication.route_id
    });
    
    showToast('Medication scanned!');
  };
  
  return (
    <div>
      <BarcodeScanner onScan={handleScan} />
      <p>Point camera at medication label</p>
    </div>
  );
}
```

---

### **Feature 3: Quick Actions Widget**
**Use Case:** iOS/Android home screen widget

```tsx
// Widget config (iOS)
{
  "name": "PPN Quick Actions",
  "description": "Log protocol or check safety alerts",
  "sizes": ["small", "medium"],
  "actions": [
    {
      "title": "Log Protocol",
      "url": "ppn://protocol-builder",
      "icon": "plus"
    },
    {
      "title": "Safety Alerts",
      "url": "ppn://safety-surveillance",
      "icon": "shield",
      "badge": "3"
    }
  ]
}
```

---

## ✅ MOBILE OPTIMIZATION CHECKLIST

### **DESIGNER Tasks:**

**Phase 1: Touch Optimization (4 hours)**
- [ ] Increase all button sizes to ≥ 48px
- [ ] Increase form input sizes to ≥ 48px
- [ ] Increase checkbox/radio sizes to 24px
- [ ] Add bottom navigation for mobile
- [ ] Add FAB for primary action

**Phase 2: Layout Optimization (6 hours)**
- [ ] Create mobile-first Dashboard layout
- [ ] Create mobile Protocol Builder (wizard style)
- [ ] Optimize charts for mobile (simplified)
- [ ] Optimize tables for mobile (card view)
- [ ] Add pull-to-refresh

**Phase 3: PWA Implementation (4 hours)**
- [ ] Create web app manifest
- [ ] Design app icons (192px, 512px)
- [ ] Create splash screens
- [ ] Add install prompt
- [ ] Test on iOS and Android

**Total:** 14 hours

---

### **BUILDER Tasks:**

**Phase 1: Performance (6 hours)**
- [ ] Implement code splitting
- [ ] Optimize images (WebP, srcset)
- [ ] Add lazy loading
- [ ] Reduce bundle size (<500KB)
- [ ] Test on 3G (< 1.5s FCP)

**Phase 2: Offline Support (8 hours)**
- [ ] Implement service worker
- [ ] Add IndexedDB for offline storage
- [ ] Add sync queue
- [ ] Add offline indicator
- [ ] Test offline functionality

**Phase 3: PWA Features (6 hours)**
- [ ] Register service worker
- [ ] Implement push notifications
- [ ] Add install prompt
- [ ] Add update notification
- [ ] Test on iOS and Android

**Total:** 20 hours

---

## 📊 SUCCESS METRICS

### **Performance:**
- First Contentful Paint: < 1.5s on 3G
- Time to Interactive: < 3s on 3G
- Lighthouse Mobile Score: > 90
- Bundle size: < 500KB (gzipped)

### **Usability:**
- Mobile conversion rate: > 80% (vs. desktop)
- Mobile task completion: > 90%
- Mobile error rate: < 5%
- Mobile session duration: > 5 minutes

### **Adoption:**
- PWA installs: > 40% of mobile users
- Mobile usage: > 60% of total traffic
- Push notification opt-in: > 50%
- Offline usage: > 20% of sessions

---

## 🎯 PRIORITY RECOMMENDATIONS

### **Critical (This Week):**
1. Touch optimization (button sizes, tap targets)
2. Bottom navigation (thumb-friendly)
3. Mobile Protocol Builder (wizard style)
4. Performance optimization (code splitting, lazy loading)

### **High Priority (Next Week):**
5. PWA implementation (manifest, service worker)
6. Offline support (IndexedDB, sync queue)
7. Mobile Dashboard (card layout)
8. Mobile charts (simplified)

### **Medium Priority (This Month):**
9. Push notifications (safety alerts)
10. Voice input (hands-free logging)
11. Camera scan (medication labels)
12. Quick actions widget

---

**Status:** ✅ Mobile strategy complete  
**Next:** DESIGNER + BUILDER implement mobile optimizations 📱
