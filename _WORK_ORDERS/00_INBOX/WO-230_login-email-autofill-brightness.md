---
id: WO-230
status: 00_INBOX
owner: PENDING
priority: P2
failure_count: 0
repeat_request: false
created: 2026-02-19
---

# WO-230: Login — Email Field Too Bright (Browser Autofill Override)

## User Prompt (verbatim)
"Login modal: email box is too bright"

## Root Cause
Browser autofill (Chrome/Safari) overrides input background with a yellow/white color. The dark theme background `bg-[#0c0f14]` gets replaced by the browser's autofill style, making the field appear blindingly bright against the dark card.

## Fix Required
Add CSS autofill override to `src/index.css` or directly to the input:
```css
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 1000px #0c0f14 inset !important;
  -webkit-text-fill-color: #cbd5e1 !important;
  caret-color: #cbd5e1 !important;
  transition: background-color 5000s ease-in-out 0s;
}
```

## Acceptance Criteria
- [ ] Email field maintains dark background when autofilled by browser
- [ ] Text remains readable (light color on dark background)
- [ ] Tested in Chrome and Safari

## LEAD NOTES
Quick BUILDER fix. Single CSS rule in index.css.
