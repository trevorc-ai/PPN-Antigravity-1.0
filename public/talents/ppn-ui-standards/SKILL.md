---
name: ppn-ui-standards
description: MANDATORY CSS, Tailwind, and Accessibility rules for the Psychedelic Practitioner Network.
---

# PPN UI STANDARDS & ACCESSIBILITY PROTOCOL

🚨 FATAL VIOLATION WARNING: You must check every line of UI code against these 4 rules. Failure to comply breaks the application for our color-blind lead designer and our clinical users.

## 1. THE COLOR-BLINDNESS MANDATE
* NEVER rely purely on color to convey meaning, status, or alerts. 
* If you use a color class (e.g., `text-red-500`, `bg-green-500`), you MUST include an accompanying Lucide React icon (e.g., `<AlertTriangle />`, `<CheckCircle />`) OR explicit text.

## 2. THE TYPOGRAPHY RULE
* The absolute minimum font size for the entire application is 14px (`text-sm`). 
* You are strictly FORBIDDEN from using the Tailwind class `text-xs`. 

## 3. THE CLINICAL SCI-FI AESTHETIC
* **Backgrounds:** Never use flat black. Use Deep Slate (`#020408` or Tailwind equivalent `bg-slate-950`).
* **Containers:** Standard panels must use the PPN Glass effect: `bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-6`.
* **Forms:** NO free-text `<textarea>` inputs. 

## 4. THE EM DASH BAN
* You are strictly forbidden from using the em dash character (—). Use a standard hyphen (-) or colon (:) instead.