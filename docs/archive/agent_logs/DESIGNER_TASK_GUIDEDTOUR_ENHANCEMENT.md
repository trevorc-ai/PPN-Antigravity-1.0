# 🎨 DESIGNER TASK - GuidedTour Enhancement & Rebuild

**Assigned To:** DESIGNER Agent  
**Priority:** P1 - High  
**Estimated Time:** 8-12 hours  
**Due Date:** 2026-02-15

---

## 📋 MISSION

Rebuild and enhance the `GuidedTour.tsx` component to create an exceptional onboarding experience for the PPN Research Portal. The current tour is functional but basic (5 steps, minimal interactivity). We need a world-class, contextual tour system that impresses users and significantly reduces time-to-value.

---

## 🎯 OBJECTIVES

### Primary Goals:
1. **Increase Engagement** - Make tour completion rate >70% (currently ~30%)
2. **Reduce Support Tickets** - Cut "How do I..." questions by 50%
3. **Accelerate Onboarding** - Users log first protocol within 10 minutes
4. **Premium Experience** - Tour should feel like a AAA product feature

### Success Metrics:
- Tour completion rate: >70%
- User satisfaction (post-tour survey): >4.5/5
- Time to first protocol logged: <10 minutes
- Support ticket reduction: 50%

---

## 🔍 CURRENT STATE ANALYSIS

### Existing Tour (src/components/GuidedTour.tsx)
**Structure:**
- 5 hardcoded steps
- Single global tour (no page-specific tours)
- Basic positioning (top/bottom/left/right)
- No progress persistence
- No skip/resume functionality
- Mobile UX is poor

**Steps:**
1. Live Telemetry (Dashboard HUD)
2. Command Center (Sidebar)
3. Global Registry (Search)
4. Safety Signals (Notifications)
5. Clinical Support (Help)

**Problems:**
1. ❌ Covers only Dashboard - doesn't tour Protocol Builder, Analytics, etc.
2. ❌ No interaction - users are passive
3. ❌ No video/rich media support
4. ❌ Poor mobile positioning
5. ❌ No persistence - can't pause/resume
6. ❌ Generic messaging - not role-specific (clinician vs analyst)

---

## 🛠️ ENHANCEMENT REQUIREMENTS

### 1. **Multi-Context Tour System**

Create separate tours for different pages:

| Page | Tour Name | Steps | Priority |
|------|-----------|-------|----------|
| Dashboard | "Welcome Tour" | 6-8 | P0 |
| Protocol Builder | "Create Your First Protocol" | 10-12 | P0 |
| Analytics | "Understanding Your Data" | 8-10 | P1 |
| Data Export | "Export Compliance" | 5-6 | P2 |
| Safety Surveillance | "Safety Monitoring" | 6-8 | P1 |

**Implementation:**
```tsx
interface TourConfig {
  tourId: string;
  page: string;
  steps: TourStep[];
  autoStart?: boolean;
  completionCallback?: () => void;
}

const TOURS: Record<string, TourConfig> = {
  'welcome-dashboard': { ... },
  'protocol-builder-intro': { ... },
  'analytics-overview': { ... },
  ...
};
```

---

### 2. **Interactive Tour Steps**

**Current:** User passively clicks "Next"
**New:** User completes micro-tasks

**Examples:**
- **Dashboard Tour:** "Click on the 'Log Protocol' button to continue"
- **Protocol Builder:** "Select 'Psilocybin' from the substance dropdown"
- **Analytics:** "Hover over the chart to see detailed data"

**Implementation:**
- Detect user interactions (clicks, hovers, inputs)
- Highlight target elements with glow/pulse
- Provide instant feedback on correct actions
- Show hints if user gets stuck (15s timeout)

---

### 3. **Progress Persistence**

**Requirements:**
- Save tour progress to `localStorage`
- Allow users to pause and resume
- Remember completed tours
- Offer "Start Tour Again" option

**Data Structure:**
```typescript
interface TourProgress {
  userId: string;
  toursCompleted: string[];
  currentTour: {
    tourId: string;
    currentStep: number;
    startedAt: string;
  } | null;
  skippedTours: string[];
}
```

---

### 4. **Rich Media Support**

**Video Embeds:**
- 15-30 second tutorial clips
- Hosted on Vimeo/YouTube (no autoplay)
- Opt-in viewing (don't block tour progress)

**Screenshots/GIFs:**
- Show expected outcomes
- Highlight key UI elements
- Use before/after comparisons

**Code Examples:**
- For API/integration tours
- Copy-to-clipboard functionality

---

### 5. **Smart Positioning Engine**

**Current Issues:**
- Overlaps with sidebar on small screens
- Doesn't account for modals/overlays
- No collision detection with multiple UI elements

**New Requirements:**
- **Collision Detection:** Avoid overlapping header, sidebar, modals
- **Viewport-Aware:** Always keep tour card 100% visible
- **Responsive Breakpoints:**
  - Mobile (<768px): Bottom-sheet style tour card
  - Tablet (768-1024px): Compact card, smart positioning
  - Desktop (>1024px): Full-featured card, multi-position support
- **Z-Index Management:** Tour overlay at z-[999], backdrop at z-[998]

**Implementation:**
```tsx
const calculateOptimalPosition = (
  targetRect: DOMRect,
  cardDimensions: { width: number; height: number },
  viewport: { width: number; height: number },
  obstacles: DOMRect[] // sidebar, header, modals
): { top: number; left: number; position: 'top' | 'bottom' | 'left' | 'right' } => {
  // Smart positioning algorithm
};
```

---

### 6. **Role-Specific Tours**

**User Roles:**
- `clinician` - Focus on Protocol Builder, Safety Surveillance
- `analyst` - Focus on Analytics, Data Export
- `site_admin` - Focus on User Management, Settings
- `network_admin` - Focus on Site Management, Compliance

**Customization:**
- Different welcome messages
- Role-appropriate examples
- Hide irrelevant steps

**Implementation:**
```tsx
const getTourForRole = (tourId: string, userRole: string): TourConfig => {
  const baseTour = TOURS[tourId];
  return {
    ...baseTour,
    steps: baseTour.steps.filter(step => 
      !step.restrictedToRoles || step.restrictedToRoles.includes(userRole)
    )
  };
};
```

---

## 🎨 DESIGN REQUIREMENTS

### Visual Design

**Tour Card:**
- Glassmorphic background (`bg-[#0c1016]/95 backdrop-blur-xl`)
- 2px primary border with glow (`border-2 border-primary shadow-[0_0_15px_rgba(43,116,243,0.5)]`)
- Rounded corners (`rounded-[1.5rem]`)
- Min width: 320px, Max width: 400px
- Padding: 24px

**Highlight/Glow Effect:**
- Target element: 2px primary border, subtle glow
- Pulsing animation (1.5s duration, infinite)
- Slightly elevated z-index

**Progress Indicators:**
- Dot-based progress (like current)
- Show "Step X of Y" text
- Time estimate: "~2 minutes remaining"

**Buttons:**
- Primary: "Next" (filled primary button)
- Secondary: "Skip Tour" (ghost button, top-right)
- Tertiary: "Back" (ghost button, only show after step 1)

**Mobile Adaptations:**
- Bottom sheet drawer style (slides up from bottom)
- Swipe-to-dismiss gesture
- Larger tap targets (min 44px)
- Reduced content per step

---

### Animation Requirements

**Tour Card Entrance:**
- Fade in + scale from 0.95 to 1.0
- Duration: 300ms
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`

**Step Transitions:**
- Fade out current card (150ms)
- Fade in next card (200ms, delayed 100ms)
- Total transition: 350ms

**Highlight Pulse:**
```css
@keyframes tourPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(43, 116, 243, 0.7);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(43, 116, 243, 0);
  }
}
```

---

## 📐 TECHNICAL ARCHITECTURE

### File Structure

```
src/
├── components/
│   ├── tour/
│   │   ├── GuidedTour.tsx          # Main tour orchestrator
│   │   ├── TourCard.tsx            # Tour step card UI
│   │   ├── TourHighlight.tsx       # Element highlighting
│   │   ├── TourBackdrop.tsx        # Dimmed overlay
│   │   ├── TourProgress.tsx        # Progress tracker UI
│   │   └── useTour.ts              # Tour state management hook
│   └── ...
├── config/
│   └── tours/
│       ├── index.ts                # Export all tours
│       ├── dashboardTour.ts        # Dashboard tour config
│       ├── protocolBuilderTour.ts  # Protocol Builder tour config
│       └── ...
└── ...
```

### State Management

**Option 1: Context API (Recommended)**
```tsx
interface TourContextValue {
  activeTour: string | null;
  currentStep: number;
  isPlaying: boolean;
  startTour: (tourId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
}

export const TourProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Implementation
};
```

**Option 2: Zustand (If needed)**
- Simpler than Context for complex state
- Easier to debug
- Better performance for large apps

---

## 🎬 TOUR SPECIFICATIONS

### Tour 1: Welcome Dashboard (P0)

**Steps:**
1. **Welcome Message**
   - Selector: `#tour-welcome` (new div in Dashboard)
   - Position: Center (modal-style)
   - Content: "Welcome to PPN Research Portal! Let's take a quick tour."
   - Video: 15s overview (optional)
   - Action: Click "Start Tour"

2. **Live Telemetry HUD**
   - Selector: `#tour-telemetry-hud`
   - Position: Bottom
   - Content: "Real-time patient enrollment and safety monitoring trends."
   - Interactive: "Hover over the chart to see details"

3. **Sidebar Navigation**
   - Selector: `aside`
   - Position: Right
   - Content: "Your command center. Navigate protocols, substances, and safety logs."
   - Interactive: "Click on 'My Protocols' to continue"

4. **Quick Actions**
   - Selector: `.quick-actions` (needs ID)
   - Position: Top
   - Content: "Common tasks at your fingertips."
   - Interactive: "Click 'Log Protocol' button"

5. **Safety Dashboard**
   - Selector: `.safety-risk-matrix`
   - Position: Top
   - Content: "Monitor your clinic's safety profile vs. network benchmarks."
   - Action: Click "Next"

6. **Next Steps**
   - Selector: `.recommended-next-steps`
   - Position: Top
   - Content: "We recommend high-priority actions based on your data."
   - Action: Click "Finish Tour"

**Completion:** Redirect to Protocol Builder tour (auto-start if user clicks "Log Protocol")

---

### Tour 2: Protocol Builder (P0)

**Steps:**
1. **Introduction**
   - Position: Center
   - Content: "Let's create your first protocol. This takes ~3 minutes."
   - Action: Click "Let's Go"

2. **Subject Identifier**
   - Selector: `#patient-link-code-input`
   - Position: Bottom
   - Content: "Enter a de-identified patient code. Never use names or DOB."
   - Interactive: "Type any code (e.g., 'PT-001')"
   - Validation: Must be non-empty

3. **Substance Selection**
   - Selector: `#substance-select`
   - Position: Bottom
   - Content: "Select the primary substance for this session."
   - Interactive: "Choose 'Psilocybin' from the dropdown"

4. **Dosage Input**
   - Selector: `#dosage-input`
   - Position: Right
   - Content: "Enter the dosage amount and unit."
   - Interactive: "Type '25' and select 'mg'"

5. **Accordion Navigation**
   - Selector: `.accordion-section-2`
   - Position: Right
   - Content: "Sections expand as you complete them. Click to jump ahead."
   - Interactive: "Click 'Intervention Details' accordion"

6. **ButtonGroup UI**
   - Selector: `.button-group-sex`
   - Position: Bottom
   - Content: "For common fields, use button groups for faster data entry."
   - Interactive: "Select 'Male' or 'Female'"

7. **Safety Events (Optional)**
   - Selector: `#safety-events-section`
   - Position: Top
   - Content: "Report any adverse events here. This is optional but critical for safety."
   - Action: Click "Next"

8. **Submit Protocol**
   - Selector: `#submit-protocol-button`
   - Position: Top
   - Content: "Review your entries and submit. All data is encrypted and de-identified."
   - Interactive: "Click 'Submit Protocol'"

9. **Success Confirmation**
   - Position: Center (modal)
   - Content: "Protocol logged successfully! View it in 'My Protocols' anytime."
   - Action: Click "Done"

**Completion:** Mark tour complete, show success toast

---

## 🧪 TESTING REQUIREMENTS

### Functional Testing
- [ ] All tours load correctly
- [ ] Step navigation (Next/Back/Skip) works
- [ ] Interactive steps detect user actions
- [ ] Progress persists to localStorage
- [ ] Tours resume after page refresh
- [ ] Completion callback fires

### Visual Testing
- [ ] Tour card doesn't overlap sidebar/header
- [ ] Highlight effect doesn't break layout
- [ ] Animations are smooth (60fps)
- [ ] Mobile bottom-sheet works on iOS/Android
- [ ] Dark mode compatibility

### Cross-Browser Testing
- [ ] Chrome 100+
- [ ] Safari 15+
- [ ] Firefox 90+
- [ ] Edge 100+

### Accessibility Testing
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Screen reader announces tour steps
- [ ] Focus trap within tour card
- [ ] ARIA labels on all interactive elements

---

## 📦 DELIVERABLES

### Code:
1. `src/components/tour/GuidedTour.tsx` - Main component
2. `src/components/tour/TourCard.tsx` - Step card UI
3. `src/components/tour/TourHighlight.tsx` - Element highlighting
4. `src/components/tour/useTour.ts` - State management hook
5. `src/config/tours/` - Tour configuration files
6. Updated imports in Dashboard, Protocol Builder, etc.

### Documentation:
1. `docs/TOUR_SYSTEM.md` - Developer documentation
2. `docs/TOUR_AUTHORING_GUIDE.md` - How to create new tours
3. Inline code comments

### Testing:
1. Unit tests for tour logic
2. E2E tests for critical tours (Dashboard, Protocol Builder)
3. Visual regression tests (Percy/Chromatic)

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: Foundation (Day 1-2)
- [ ] Create new tour architecture
- [ ] Build TourCard, TourHighlight, TourBackdrop components
- [ ] Implement useTour hook with localStorage persistence
- [ ] Set up tour configuration system

### Phase 2: Core Tours (Day 3-5)
- [ ] Build Dashboard tour (6-8 steps)
- [ ] Build Protocol Builder tour (10-12 steps)
- [ ] Add interactive step detection
- [ ] Implement smart positioning engine

### Phase 3: Polish & Mobile (Day 6-7)
- [ ] Mobile bottom-sheet UI
- [ ] Add video embed support
- [ ] Improve animations
- [ ] Add role-based customization

### Phase 4: Testing & Launch (Day 8)
- [ ] Write tests
- [ ] Cross-browser testing
- [ ] Accessibility audit
- [ ] User acceptance testing

---

## 💡 NICE-TO-HAVE FEATURES (Future)

- [ ] Tour analytics (track completion rates, drop-off points)
- [ ] A/B testing different tour messages
- [ ] Multi-language support
- [ ] Voice-over narration
- [ ] Gamification (badges for completing tours)
- [ ] Admin dashboard to create tours via UI (no code)

---

## ❓ QUESTIONS FOR DESIGNER

1. **Video Hosting:** Do we have a Vimeo/YouTube account, or should tours be video-free?
2. **Branding:** Any specific brand voice for tour copy? (Formal clinical vs. friendly/casual)
3. **Length:** Is 10-12 steps too long for Protocol Builder tour? Should we split it?
4. **Auto-Start:** Should tours auto-start on first visit, or require manual trigger?

---

**DESIGNER: Ready to build?** 🎨

This is your greenlight to rebuild GuidedTour with premium UX. Focus on **Dashboard** and **Protocol Builder** tours first (P0 priority). Deliver a tour system that makes users say "Wow, this is incredible."

