---
id: WO-093
title: "Camera Scan — OCR Patient Label to PPN ID (Mobile HTML Bridge)"
status: 01_TRIAGE
owner: PRODDY
ticket_type: EVALUATION — Fast-Track Candidate
priority: P1 (High — strategic partner request, potentially trivial to build)
category: Tooling / Mobile / Onboarding / Zero-Knowledge
failure_count: 0
created_date: 2026-02-17T18:59:13-08:00
estimated_complexity: 3/10
source: strategic_partner_request
proddy_validation_required: true
fast_track_candidate: true
strategic_alignment: Clinic Onboarding / Mobile UX / GTM
deliverable_type: Standalone HTML file (single file, no framework, no backend)
requested_by: Trevor Calton
related_tickets:
  - WO-092 (01_TRIAGE — Batch Processor / Google Sheets Airlock, same onboarding context)
---

# User Request (Verbatim)

> "Camera Scan" (Ultimate Friction Remover)
> On a phone, typing "Christopher" is annoying. Taking a picture is fast.
> Most clinic patients have a Wristband or a Paper Chart with a sticker on it.
> Workflow:
> Open PPN_Bridge.html on phone.
> Tap "Scan Name".
> Camera opens -> Point at Patient Label.
> OCR (Text Recognition) reads "John Doe 01/01/80".
> Tool instantly hashes it to PPN-JODO0101.
> Is this hard to code? No. Modern browsers have a built-in "Text Detection" API, or you can use a tiny library like Tesseract.js.
>
> Last one for now. This was also requested by a strategic partner, so I wanna give this serious consideration. If this is determined to be an easy implementation, bumper to the front of the line of these Gemini suggestions.

---

## ⚡ Fast-Track Assessment

**CUE's preliminary verdict: This is the easiest ticket in this entire batch.**

| Factor | Assessment |
|---|---|
| Deliverable | Single HTML file — no React, no DB, no migrations |
| Dependencies | Zero — CDN-loaded Tesseract.js only |
| Backend required | ❌ None — 100% client-side |
| SOOP required | ❌ None |
| DESIGNER required | ⚠️ Optional — basic mobile UI only |
| BUILDER time | ~4-6 hours for a working prototype |
| Strategic signal | ✅ Strategic partner request |
| User demand | ✅ Confirmed (manual typing on mobile is a real friction point) |

**Recommendation to PRODDY/LEAD:** If strategic fit is confirmed, this should jump to the front of the Gemini suggestions queue. It's a standalone file that can be shipped independently of all other tickets.

---

## Strategic Context

This is the **mobile companion** to WO-092 (Google Sheets Batch Processor). Together they form a complete zero-knowledge patient onboarding toolkit:

| Device | Tool | Method |
|---|---|---|
| iPad / Tablet | HTML Bridge | Split screen: Copy from EHR → Paste → Hash |
| Phone | HTML Bridge + Camera | Photo of label → OCR → Auto-hash |
| Any Mobile | Google Sheets | Type name → Checkbox → Script runs |

The Camera Scan is the highest-friction-reduction option — it eliminates typing entirely for mobile users.

---

## Technical Implementation

### Deliverable: `PPN_Bridge_Camera.html` (Single File)

Everything runs in one HTML file. No server. No install. Clinic staff bookmark it on their phone.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PPN Patient Bridge</title>
  <!-- Tesseract.js via CDN — client-side OCR, no data leaves device -->
  <script src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js'></script>
</head>
<body>
  <h1>PPN Patient Bridge</h1>

  <!-- Manual entry fallback -->
  <input type="text" id="firstName" placeholder="First Name">
  <input type="text" id="lastName" placeholder="Last Name">
  <input type="date" id="dob" placeholder="Date of Birth">

  <!-- Camera scan button — opens rear camera on mobile -->
  <label>
    📷 Scan Label
    <input type="file" accept="image/*" capture="environment" 
           id="cameraInput" style="display:none" 
           onchange="processImage(this)">
  </label>

  <div id="status">Ready</div>
  <div id="ppnResult"></div>
  <button onclick="copyResult()">📋 Copy PPN ID</button>

  <script>
    async function processImage(input) {
      const file = input.files[0];
      if (!file) return;

      document.getElementById('status').textContent = '🔍 Reading label...';

      // Tesseract OCR — runs entirely on device
      const { data: { text } } = await Tesseract.recognize(file, 'eng');

      // Regex extraction
      const nameMatch = text.match(/([A-Z][a-z]+)\s+([A-Z][a-z]+)/);
      const dobMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);

      if (nameMatch && dobMatch) {
        document.getElementById('firstName').value = nameMatch[1];
        document.getElementById('lastName').value = nameMatch[2];
        // Normalize DOB to MMDD
        const mm = dobMatch[1].padStart(2, '0');
        const dd = dobMatch[2].padStart(2, '0');
        generatePPNID(nameMatch[1], nameMatch[2], mm, dd);
        document.getElementById('status').textContent = '✅ Label read successfully';
      } else {
        document.getElementById('status').textContent = 
          '⚠️ Could not read label clearly. Please fill in manually.';
      }
    }

    function generatePPNID(first, last, mm, dd) {
      const id = 'PPN-' + 
        first.substring(0, 2).toUpperCase() + 
        last.substring(0, 2).toUpperCase() + 
        mm + dd;
      document.getElementById('ppnResult').textContent = id;
      return id;
    }

    function copyResult() {
      const result = document.getElementById('ppnResult').textContent;
      navigator.clipboard.writeText(result);
      document.getElementById('status').textContent = '📋 Copied to clipboard!';
    }
  </script>
</body>
</html>
```

### OCR Technology Options

| Option | Pros | Cons | Recommendation |
|---|---|---|---|
| **Tesseract.js (CDN)** | Proven, 100% client-side, free | ~4MB download, slower on old phones | ✅ Best for MVP |
| **Web Text Detection API** | Native browser, instant, no download | Chrome/Android only, not Safari/iOS | ⚠️ Use as progressive enhancement |
| **Google Cloud Vision** | Highest accuracy | Sends image to Google server — ❌ PHI risk | ❌ Violates zero-knowledge rule |

**Recommended approach:** Use Tesseract.js as primary, with Web Text Detection API as a fast-path fallback on supported browsers.

```javascript
// Progressive enhancement: try native API first, fall back to Tesseract
async function processImage(file) {
  if ('TextDetector' in window) {
    // Native browser API (Chrome/Android) — instant, no download
    const detector = new TextDetector();
    const bitmap = await createImageBitmap(file);
    const texts = await detector.detect(bitmap);
    return texts.map(t => t.rawValue).join(' ');
  } else {
    // Tesseract.js fallback — works everywhere including iOS Safari
    const { data: { text } } = await Tesseract.recognize(file, 'eng');
    return text;
  }
}
```

---

## Regex Extraction Logic

Patient labels vary by EHR system. The regex needs to handle common formats:

```javascript
const patterns = {
  // "John Doe" or "DOE, JOHN"
  name: [
    /([A-Z][a-z]+)\s+([A-Z][a-z]+)/,           // First Last
    /([A-Z]+),\s*([A-Z]+)/,                      // LAST, FIRST
  ],
  // DOB formats: 01/01/80, 01-01-1980, Jan 1, 1980
  dob: [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/, // MM/DD/YY or MM-DD-YYYY
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),?\s+(\d{4})/i,
  ]
};
```

---

## Zero-Knowledge Guarantee

- ✅ Image processed entirely on device (Tesseract.js runs in browser)
- ✅ No image uploaded to any server
- ✅ No patient name stored — only PPN ID generated
- ✅ PPN ID is a one-way hash (cannot reverse to get name)
- ✅ Works offline after initial page load (if Tesseract worker cached)

---

## Acceptance Criteria (If Approved)

### Core Functionality
- [ ] `📷 Scan Label` button opens rear camera on mobile
- [ ] Tesseract.js processes image client-side (no server upload)
- [ ] Regex extracts first name, last name, DOB from OCR text
- [ ] Auto-fills name/DOB fields and generates PPN ID
- [ ] Manual entry fallback if OCR fails
- [ ] `📋 Copy PPN ID` button copies result to clipboard

### Compatibility
- [ ] Works on iOS Safari (iPhone)
- [ ] Works on Android Chrome
- [ ] Works on iPad
- [ ] Graceful fallback if camera unavailable (file picker instead)
- [ ] Offline capable after first load

### Zero-Knowledge
- [ ] No image data transmitted to any server
- [ ] No patient name persisted in localStorage or cookies
- [ ] Tesseract.js loaded from CDN (no custom backend)

### Accessibility
- [ ] Large touch targets (minimum 48px) for mobile use
- [ ] High contrast UI (usable in clinic lighting)
- [ ] Screen reader compatible
- [ ] Minimum 16px fonts (mobile readability)

---

## Open Questions for PRODDY

1. **Standalone file vs. in-app feature:** Should this be a standalone `PPN_Bridge_Camera.html` (shareable link, no login required) or integrated into the PPN Portal as a mobile page? Standalone is faster to ship.
2. **Tesseract.js CDN dependency:** If the clinic has no internet, Tesseract won't load. Should the worker be embedded in the HTML file? (Increases file size to ~8MB but enables true offline use.)
3. **Label format variability:** Different EHRs print labels differently. Should we build a "label format selector" (SimplePractice, Osmind, custom) to tune the regex?
4. **Collision handling:** Same collision risk as WO-092 — `PPN-JODO0101` can collide. Coordinate with WO-092 on the ID format decision.

---

## Relationship to WO-092

This ticket and WO-092 (Batch Processor) are **complementary, not competing**:
- WO-092 = bulk onboarding (500 patients at once, desktop workflow)
- WO-093 = point-of-care lookup (1 patient at a time, mobile workflow)

Both should use the **same PPN ID formula** — coordinate the collision-resistance decision across both tickets.

---

## 🚦 Status

**01_TRIAGE → PRODDY** — Fast-track evaluation. PRODDY to confirm:
1. Strategic fit (partner request — high signal)
2. Standalone HTML vs. in-app integration decision
3. PPN ID formula coordination with WO-092
4. If approved: recommend routing directly to BUILDER (estimated 4-6 hours, no DESIGNER or SOOP needed)
