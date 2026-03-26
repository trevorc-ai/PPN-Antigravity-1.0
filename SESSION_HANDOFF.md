# SESSION_HANDOFF.md
**Last updated:** 2026-03-24 15:35 PDT | **Session focus:** Pipeline scan + WO-673 Ibogaine contraindication engine (COMPLETE)

## ⚡ START HERE — Commands Available Every Session

| Command | What it does |
|---|---|
| `/fast-track [one sentence]` | LEAD classifies, creates a ticket, and routes it. No pipeline knowledge required. |
| `/ppn-ui-standards [filename]` | Audits the named file for standards violations and fixes them in-place. |
| `/lead-pipeline-scan` | Full pipeline audit: surfaces all stuck tickets, backlogs, and next actions. |
| `/finalize_feature` | INSPECTOR-only: stage, commit, post push confirmation to user. |
| `/session-handoff` | LEAD updates this file at end of session. Run before signing off. |

> [!NOTE]
> Phase 5.5 of inspector-qa **requires** a browser screenshot + @USER notification before any ticket reaches `06_USER_REVIEW`. If you are not seeing screenshots and review prompts, the agent skipped Phase 5.5. Invoke INSPECTOR with `/inspector-qa-script`.

---

## 🔴 Active / In-Flight

| Ticket | Stage | Notes |
|---|---|---|
| **WO-673** | `06_USER_REVIEW` → **PUSH PENDING** | Committed at `9085749`. User must reply `push` to deploy. |
| WO-665 | `04_BUILD` | Help & Export Hub full UI/UX overhaul. |
| WO-668 | `04_BUILD` | COWS/SOWS/BAWS/ASI assessment cards. |
| WO-669 | `04_BUILD` | SARA/FTN/HKS cerebellar assessments. |
| WO-671 | `04_BUILD` | Ibogaine dosing logger + real-time mg/kg calculator. |
| WO-672 | `04_BUILD` | QTc 4-tier alert system (no hard block). |

---

## ✅ Completed This Session (2026-03-24)

- **Pipeline scan** — All queues audited. WO-668/669/671/672 moved from 03_REVIEW to 04_BUILD (INSPECTOR pre-cleared).
- **WO-659** — Routed from 00_INBOX to 01_DESIGN (DESIGNER spec needed for tablet sidebar).
- **WO-661** — Routed from 00_INBOX to 03_REVIEW with INSPECTOR fast-pass; queued for 04_BUILD when slot opens.
- **WO-670** — Routed from 00_INBOX to 02_TRIAGE; 5 open questions for user before architecture can be finalized.
- **WO-673 (P0)** — **COMPLETE.** 6 absolute + 8 relative Ibogaine contraindication rules implemented in `contraindicationEngine.ts`. 9/9 test cases passed. QA approved. Committed `9085749`. **PUSH PENDING.**
- **FREEZE.md** — `contraindicationEngine.ts` re-frozen by user post-commit.

---

## 🟡 Needs User Decision

1. **WO-673 — PUSH** — Committed at `9085749`. Reply `push` to deploy to production.
2. **WO-670 (P2) — 5 open questions** before architecture finalized:
   - SLUMS scope: Ibogaine-only or also ketamine sessions?
   - Co-development lead: PRODDY coordinates, Dr. Allen + Vega define domains — confirm?
   - MSE format: Fully structured dropdowns (Zero-PHI) — confirmed?
   - PDF placement: Where do MSE + cognitive scores appear in session PDF?
   - Global Benchmark: Should post-session cognitive delta feed the benchmark layer?
3. **Morphology flags (ECG)** — Dr. Allen meeting Dr. Vega Wednesday. Update WO-669 + DESIGNER mockup after that call.
4. **WO-655 double-filing** — Two tickets both numbered WO-655 exist. LEAD must resolve before new WOs in that range.

---

## 🔵 Pipeline State

| Queue | Count | Key Tickets |
|---|---|---|
| `04_BUILD` | 5 | WO-665, WO-668, WO-669, WO-671, WO-672 — start WO-668 (lowest #) |
| `03_REVIEW` | 1 | WO-661 (fast-passed — waiting for 04_BUILD slot) |
| `05_QA` | 5 | WO-642, WO-644, WO-658, WO-666, WO-B6 |
| `06_USER_REVIEW` | 1 | WO-673 — PUSH PENDING |
| `02_TRIAGE` | ~9 | WO-670 + 8 analytics WOs (WO-677 through WO-687 range) |
| `98_HOLD` | ~30 | No changes this session |

---

## ⚪ Next Recommended Actions

1. **USER → reply `push`** to deploy WO-673 to production (commit `9085749` is staged).
2. **BUILDER → WO-668** — Start COWS/SOWS/BAWS/ASI assessment cards (next in 04_BUILD queue after WO-673 slot freed).
3. **After Dr. Allen/Vega Wednesday call** — Update morphology flags in WO-669, then DESIGNER updates Stitch mockup for ECG morphology chip set.

---

## 📋 Protocol Changes Made This Session

| File | Version | Change |
|---|---|---|
| `contraindicationEngine.ts` | WO-673 | 14 Ibogaine rules added (6 abs, 8 rel). Re-frozen in FREEZE.md. |
| `FREEZE.md` | 2026-03-24 | `contraindicationEngine.ts` re-frozen by user post-commit. |

---

## Key Clinical Context (Do Not Lose)

- **Dr. Allen** — 600+ Ibogaine sessions, paper in preparation on QTc thresholds. His numbers override standard references on this platform.
- **QTc thresholds (FINAL):** Green <490 / Amber 490 / Orange 500+ / Red advisory 550+ — **NO hard block at any level**
- **Substance types:** Ibogaine HCL and TPA (Total Plant Alkaloid) are co-equal primary substances — not alternatives
- **No ibogaine + ketamine mixing** in Dr. Allen's protocol
- **Assessments are elective** — no assessment is a hard gate on Phase 2 entry, per Dr. Allen
- **Ataxia grading:** 0 / +1 / +2 / +3 ordinal scale used alongside SARA
- **mg/kg running total:** Real-time per-dose cumulative calculation — computed client-side, not stored in DB
