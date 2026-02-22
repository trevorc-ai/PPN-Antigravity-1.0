---
status: "03_BUILD"
owner: "BUILDER"
failure_count: 0
---

# WO-316: Sidebar Navigation Rearchitecture

## User Prompt & Strategy Motivation
The user correctly observed that the sidebar on desktop is showing mobile-only utilities (like the Patient Bridge) at the top. The sidebar needs to be smarter and dynamically render utilities based on the device, while keeping the UX clean for feature discovery.

## LEAD ARCHITECTURE
**Objective:** Rearchitect the layout and rendering logic of `Sidebar.tsx` and `MobileSidebar.tsx`.

1. **Device-Specific Links:** Implement simple breakpoint logic or device detectors so that the "Patient Bridge" strictly appears only when a mobile form factor is used or provide a "Mobile Integrations" modal containing a QR Code for desktop users.
2. **Integrations Category:** Consolidate external tools and physical device connections (Apple Watch, Mobile Camera, OCR Docs) into an "Integrations" section within the navigation schema. 
3. **Quick Actions Component Hooks:** Rather than displaying every minor form link in the sidebar directly, provide an extensible Quick Actions or Command Center component approach that progressive discloses features to users.

**Instructions for BUILDER:**
- Modify `/src/components/Sidebar.tsx` and its navigation array.
- Group the new additions.
- Ensure the changes sync functionally with `/src/components/MobileSidebar.tsx`.
- Review the `/src/components/CommandMenu.tsx` (or equivalent) to integrate any minor utilities there.

**Owner: BUILDER | Status: 03_BUILD**
