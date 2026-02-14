# Command #013: Update GuidedTour with Unique Value Proposition

**Date Issued:** Feb 13, 2026, 6:10 PM PST  
**Issued By:** LEAD (on behalf of User)  
**Assigned To:** BUILDER  
**Priority:** P1 - HIGH  
**Estimated Time:** 1-2 hours  
**Start After:** Command #009 (TopHeader fix) complete

---

## DIRECTIVE

Update `GuidedTour.tsx` to reflect the platform's unique value proposition and working analytics features.

**User's Value Proposition:**
> "Decentralized, anonymized, peer-to-peer protocol and outcome data sharing, and a real-time clinical intelligence platform that augments practitioner decision-making while simultaneously building the world's largest psychedelic therapy evidence base."

---

## CURRENT TOUR STEPS (OUTDATED)

1. Live Telemetry - "Real-time patient enrollment data and safety monitoring trends"
2. Command Center - "Navigate the research registry, substances, and audit logs"
3. Global Registry - "Instant access to cross-node search for protocols and compounds"
4. Safety Signals - "Urgent adverse event alerts and protocol updates"
5. Clinical Support - "Access regulatory guidelines and technical support"

---

## NEW TOUR STEPS (UPDATED)

### Step 1: Network Intelligence Hub
**Selector:** `#tour-telemetry-hud`  
**Title:** "Network Intelligence Hub"  
**Description:** "Real-time peer-to-peer protocol sharing. Your anonymized data contributes to the world's largest psychedelic therapy evidence base while you gain insights from thousands of practitioners worldwide."

### Step 2: Clinical Decision Support
**Selector:** `aside`  
**Title:** "Clinical Decision Support"  
**Description:** "Access working analytics: Performance Radar, Patient Galaxy, Molecular Pharmacology, Safety Benchmarking, and Regulatory Map. These tools augment your decision-making with network-wide intelligence."

### Step 3: Protocol Builder
**Selector:** `#tour-protocol-builder` (or appropriate selector)  
**Title:** "Decentralized Protocol Sharing"  
**Description:** "Create protocols that automatically contribute anonymized outcomes to the network. Every protocol you submit helps build evidence-based best practices for the entire community."

### Step 4: Safety Surveillance
**Selector:** `#tour-notifications`  
**Title:** "Real-Time Safety Alerts"  
**Description:** "Network-wide adverse event monitoring. If a safety signal emerges anywhere in the network, you'll know immediately—protecting your patients and advancing the field."

### Step 5: Analytics Dashboard
**Selector:** `#tour-analytics` (or link to Analytics page)  
**Title:** "Clinical Intelligence Platform"  
**Description:** "Compare your outcomes against network benchmarks. See how your protocols perform, identify trends, and access molecular pharmacology data—all powered by decentralized peer-to-peer data sharing."

---

## IMPLEMENTATION

**File:** `src/components/GuidedTour.tsx`

**Changes Required:**
1. Update `TOUR_STEPS` array (lines 12-43)
2. Update selectors to match current Dashboard elements
3. Add new step for Analytics page
4. Update descriptions to emphasize:
   - Decentralized peer-to-peer data sharing
   - Real-time clinical intelligence
   - Network-wide evidence base
   - Practitioner decision augmentation

---

## VERIFICATION

1. Run guided tour on Dashboard
2. Verify all selectors highlight correct elements
3. Confirm messaging reflects unique value proposition
4. Test on mobile and desktop

---

## DELIVERABLE

- ✅ Updated GuidedTour.tsx with new messaging
- ✅ All 5 steps functional
- ✅ Value proposition clearly communicated
- ✅ Screenshot of updated tour

---

**START AFTER TOPHEADER FIX COMPLETE**
