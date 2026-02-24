---
status: "01_TRIAGE"
owner: "LEAD"
failure_count: 0
---

# WO-315: UX Strategy, Visual Showcase & Partner Hub Fixes

## User Prompt
"I'D LIKE YOU TO GIVE THE SIDEBAR AND THE COMPONENT SHOWCASE A CLOSER LOOK TO SEE HOW WE MIGHT BETTER ORGANIZE THE SIDE BAR AND OTHER WAYS FOR USERS TO DISCOVER ALL OF THE FUNCTIONALITY AND FEATURES OF THE SITE. FOR INSTANCE, ONE THING COMES TO MIND WE HAVE NOW A MOBILE ONLY PATIENT BRIDGE that should not be the second item on the sidebar for desktop users. We also added an OCR feature. Apple Watch integration is coming, etc...

Also, we gave the main landing page a little bit of extra design touch. But I feel like we could do a better job of actually showcasing what the users are going to get and the transformation it will bring for them, but represented visually...

The checkout page, and most other work orders are almost all done and implemented. So we're going to need to update the user manual/help page guide... Can we have the agents design really robust help pages? We should probably also update the partner hub and Jason's demo page... Is that something we can do easily? If so, let me know how I can help.

Oh, and please fix the CTA button at the bottom of the partner hub."

## LEAD ARCHITECTURE
Routing directly to PRODDY to handle the strategic UX/UI assessment and provide the checklist to the user.

## PRODDY STRATEGY (Final)
- [x] Fix CTA button on Partner Hub (`public/partner-hub.html` constraint fixed)

### 1. Sidebar Organization Strategy
- **Device-Specific Rendering:** Desktop view should hide "Patient Bridge" since it's a mobile camera utility.
- **Integrations Hub:** Create a new sidebar category for "Connected Devices / Integrations", encompassing Apple Watch, Mobile Patient Bridge, and Document OCR.
- **Progressive Disclosure:** Migrate secondary tools to a Quick Actions floating button or Command Center instead of cluttering the sidebar.

### 2. Landing Page Visual Showcase (Bento Box)
- Transition the Landing Page features to a "Bento Box" grid structure.
- Emphasize visual representation of UI components (e.g., Interaction Checker passing, Analytics graph rising) instead of static text blocks.
- Introduce hover effects and micro-animations to simulate product usage and effectively communicate the "Before & After" transformation.

### 3. Help Pages / User Manual Shell
- Construct an MDX-based Help Center layout with built-in search functionality.
- Develop placeholder skeleton screens for the user's upcoming screenshots.
- Ensure the layout matches the platform's visual identity with clean navigation.

**Handoff to LEAD:** The strategy is complete. Break these into 3 distinct engineering / design tickets (WO-316, WO-317, WO-318) and route to the correct queues.
