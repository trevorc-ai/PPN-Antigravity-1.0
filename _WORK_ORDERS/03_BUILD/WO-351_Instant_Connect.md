---
status: 03_BUILD
owner: BUILDER
failure_count: 0
---

# User Request
so has the product strategist how can we get our product on the screen of mobile phones that's what matters more than email mobile tablet tablet to mobile instant connect gotta be that super fast element easy simple to two clicks

## PRODDY STRATEGY & ROADMAP (PRD)

The goal is zero-friction cross-device mobility. We need the transition from desktop/tablet to the mobile device to be instantaneous, avoiding app store downloads and eliminating clunky password logins. "Two clicks" means we skip the traditional authentication and sign-in funnels entirely when they are already active on a larger screen.

### 1. Magic Device Handoff (QR Auth)
*   **The Problem:** Asking users to open their mobile browser, type a URL, and log in again is a massive conversion drop-off.
*   **The Solution:** A persistent "Send to Phone" icon in our desktop/tablet navigation. 
    *   **Click 1:** User taps the icon. A beautiful, dynamic QR code instantly appears.
    *   **Click 2 / Scan:** User scans the QR code with their phone's native camera. 
    *   **The Magic:** The QR code contains a highly secure, short-lived authentication token payload. Scanning it opens the mobile web app and *instantly logs them into their exact current state*. No typing. No passwords. Context is transferred instantaneously.

### 2. Progressive Web App (PWA) "Add to Home Screen"
*   **The Problem:** We want users to treat this like a native iOS/Android app (icon on home screen) without the friction, wait times, and 30% taxes of the Apple/Google App Stores.
*   **The Solution:** Convert the React app into a fully optimized Progressive Web App (PWA). Once they scan the magic QR code and land on mobile, we trigger a heavily stylized, branded prompt: *"Install to your home screen for instant access."* Tapping "Install" places our app icon directly on their phone, indistinguishable from a native app.

### 3. SMS Auth Injection (Fallback)
*   **The Problem:** Some clinical environments or older devices may struggle with QR.
*   **The Solution:** Next to the QR code, offer a "Text this to my phone" button. It instantly fires an SMS containing the same secure magic link. Tapping the link opens the mobile browser, fully authenticated.

### 4. Zero-UI NFC Tap (In-Clinic Future Phase)
*   **The Solution:** For the clinical waiting room, cheap NFC stickers placed on desks allow patients to tap their phone and instantly open their digital check-in or journey roadmap. 

---

### Handoff Instructions for LEAD:
Strategy defined. I have routed this ticket to LEAD to architect the token generation, local-storage state-transfer, and secure redirect logic.

## LEAD ARCHITECTURE
**Technical Constraints & Approach:**
1. **Tooling:** Use `qrcode.react` (already standard, or install if missing) to generate an SVG/canvas QR code in the frontend.
2. **Payload Routing:** The QR should contain a deep link `https://[domain.com]/auth/magic?token=[secure_uuid]&returnTo=[current_path]`.
3. **PWA Configuration:** Validate our `manifest.json` and ensure the service worker registers properly for the "Add to Home Screen" prompt to work natively. Create an aesthetically pleasing PWA prompt if it needs to be triggered manually.
4. **State Storage:** When scanning, the receiver must securely set local tokens/auth context into `localStorage` before redirecting to `returnTo`.
5. **Component Execution:** BUILDER is to build the actual 'Send to Phone' modal (accessed via the main patient or provider navigation bar). It should include a dummy QR code in MVP testing mode.
