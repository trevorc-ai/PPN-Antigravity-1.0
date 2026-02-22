---
id: WO-117
status: 03_BUILD
owner: BUILDER
failure_count: 0
created: 2026-02-19
priority: HIGH
ticket_type: design + quick-build
pages_affected:
  - src/pages/Login.tsx
user_prompt_verbatim: "I like the new pricing page, and so we may want to upgrade the login screen to match because they look very different; both should be consistent with the CSS. On the login screen, please move the 'forgot password' link below the password field, it creates an extra tab motion for the user."
---

## LEAD ARCHITECTURE

Two tasks, both in Login.tsx. No DB changes. Quick build — DESIGNER may implement directly.

---

## TASK 1 — Move "Forgot Password" Below the Password Field

### Current bug (Login.tsx lines 152–163)
The `Forgot Password?` link lives inside the `flex justify-between` row with the Password label — meaning Tab order goes: Email → Password label row (hits Forgot Password button) → Password input → Submit. This wastes a tab stop.

### Fix
Move the `<button type="button" onClick={() => setShowResetModal(true)}>Forgot Password?</button>` to **below** the `<input type="password">` field, right-aligned, as a standalone line. New structure:

```tsx
{/* Password Field */}
<div>
  <label className="block text-sm font-bold text-slate-300 mb-2">Password</label>
  <input type="password" ... />
  {/* Forgot password — below field, right-aligned, does not interrupt tab flow */}
  <div className="flex justify-end mt-2">
    <button type="button" onClick={() => setShowResetModal(true)}
      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
      Forgot Password?
    </button>
  </div>
</div>
```

Tab order becomes: Email → Password input → Submit → (Forgot Password is reachable but out of primary flow). ✅

---

## TASK 2 — Redesign Login to Match Pricing Page Aesthetic

### Current Login.tsx visual profile
- Background: plain `bg-[#0B0E14]` with two soft radial blurs
- Card: `bg-slate-900/50 border border-slate-800 rounded-2xl p-8` — basic, minimal
- Logo: simple `w-12 h-12 bg-indigo-600 rounded-xl` block icon
- No decorative elements, no gradient glow on card

### Pricing.tsx visual profile (target)
- Background: `bg-[#05070a]` — deeper black
- Cards: `bg-[#1c222d]/40 border border-slate-800 rounded-[2.5rem] p-8 sm:p-10` — larger radius, glassmorphic tint
- Accent banner: amber glow border with `blur opacity-75 absolute -inset-0.5` technique
- Typography: `font-black tracking-tighter` on headings, `uppercase tracking-[0.2em]` on labels
- Buttons: `rounded-2xl uppercase tracking-[0.2em]` with colored shadow (`shadow-xl shadow-primary/20`)
- Feature list items using `material-symbols-outlined check_circle` in primary color

### DESIGNER Deliverables — Update Login.tsx to match Pricing aesthetic:

1. **Background**: Change to `bg-[#05070a]`. Keep the radial blur orbs but increase to match Pricing's darker base.

2. **Card container**: Change to `bg-[#1c222d]/40 border border-slate-800 rounded-[2.5rem] p-8 sm:p-10 backdrop-blur-sm`. Add a subtle indigo glow ring (like Pricing's amber ring technique):
   ```tsx
   <div className="relative">
     <div className="absolute -inset-0.5 bg-indigo-500/10 blur opacity-60 rounded-[2.5rem]" />
     <div className="relative bg-[#1c222d]/40 border border-slate-800 rounded-[2.5rem] p-8 sm:p-10 backdrop-blur-sm">
       ...form content...
     </div>
   </div>
   ```

3. **Logo/branding header**: Replace the plain icon block with a styled header matching Pricing's h1 treatment:
   ```tsx
   <h1 className="text-4xl font-black tracking-tighter text-slate-300">PPN <span className="text-primary">Portal</span></h1>
   <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Secure Clinical Intelligence Network</p>
   ```
   Keep the `Activity` icon but use `w-14 h-14 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl` (softer, like Pricing's icon boxes).

4. **Input fields**: Keep existing functionality but upgrade styling:
   - `bg-[#0c0f14] border border-slate-700/50 rounded-xl px-5 py-3.5` (matching Pricing's darker inner tone)
   - On focus: `focus:border-primary/50 focus:ring-1 focus:ring-primary/20`

5. **Submit button**: Change to `bg-primary hover:bg-blue-600 rounded-2xl text-sm font-black uppercase tracking-[0.2em] py-4 shadow-xl shadow-primary/20 active:scale-95` — matching Pricing CTA style.

6. **"Sign Up" link section**: Style the divider and sign-up prompt to match Pricing's subdued `text-slate-500 text-sm uppercase tracking-widest` label style.

7. **Security badge**: Move below the card into a standalone centered row — already done, just ensure font matches `text-xs font-black uppercase tracking-widest text-slate-600`.

8. **Password Reset Modal**: Upgrade modal card to `rounded-[2.5rem]` and `bg-[#1c222d]/40` to match the new card style.

---

## Acceptance Criteria
- [ ] Tab order: Email → Password input → Submit (Forgot Password does NOT interrupt)
- [ ] Login card uses `rounded-[2.5rem]` radius matching Pricing cards
- [ ] Background `bg-[#05070a]` matching Pricing
- [ ] Submit button has uppercase tracking + shadow matching Pricing CTAs
- [ ] All fonts ≥ 12px
- [ ] No color-only status signals
- [ ] Redirect banner (amber) and error states remain functional
- [ ] Zero new TypeScript errors
