---
status: 00_INBOX
owner: PENDING
failure_count: 0
---

# WO-401: Patient-Facing Companion UI (Live Session)

## User Request Verbatim
"Oh, this gives me an idea about a patient-facing interface. This whole time I've only been looking at this from the practitioners perspective. But what if we also created a patient facing form that the patient could have with them throughout the entire treatment. So they could enter their own feelings in real time, and perhaps give them things like "spherecules" to look at in the meantime. I'm not sure how that would work if the record were open on two separate devices at the same time, but it seems like we could do it. I'm picturing the patient in a room by themselves, just receiving their dosing. The practitioner gave them a tablet to keep with them during the session, and every so often they are able to identify something they are feeling or experiencing, and can just tap and enter it in real time. This would be a game changer as opposed to them having to narrate it to the practitioner verbally, if they didn't want to, or having to remember everything after the session ends. Thoughts on this?"

## CUE Intake Notes
- **Core Concept**: A secondary, patient-facing application interface explicitly meant for use during Phase 2 (Live Dosing Session).
- **Primary Function**: Non-verbal, real-time subjective experience logging by the patient on a tablet provided by the practitioner.
- **Visuals**: Needs passive, calming, ambient visuals ("spherecules") when not actively taking input.
- **Technical Approach**: Handling concurrent state management between practitioner dashboard and patient companion app. Data synchronization does NOT need to be real-time; the companion app can store inputs locally and sync to the main session record after the dose is complete.
- **Therapeutic Addition**: The "spherecules" visual could tie perfectly into the 4-7-8 (or 4-4-4 box breathing) cadences previously mentioned by PRODDY, actively guiding the patient's breath without needing verbal instruction.

## Questions for LEAD / PRODDY Consideration
1. What does the data structure look like for these real-time patient inputs versus practitioner clinical observations?
2. Are "spherecules" possible to implement visually in the browser cleanly, perhaps using WebGL or CSS animations?
3. How do we securely authenticate a patient on a practitioner's device without exposing other records? Should it be a distinct "Session Mode" route/app that locks the rest of the application down?
