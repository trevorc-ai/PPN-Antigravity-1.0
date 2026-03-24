INSTRUCTIONS: Adapt to PPN Portal CSS as needed.

As a Senior UI/UX Designer for medical software, I approach this specific use case—psychedelic clinical therapy—with a unique set of constraints. Psychedelic sessions (especially with ibogaine) are often conducted in dimly lit rooms, involve long hours (12+ hours), and place the practitioner under high cognitive load.

The primary UX goal is **glanceability**: the doctor should be able to read critical data from three feet away without touching the screen. The interface must be entirely frictionless so the technology doesn't pull the practitioner's attention away from the patient.

Here is the ideal tablet layout and component strategy (optimized for **Landscape Mode**, which provides the best horizontal space for data tables and dashboards).

### **1\. Core UX Principles for this Application**

* **Default to Dark Mode:** Psychedelic therapy environments are typically low-light to reduce patient stimulation. A bright white screen will cause eye strain and disrupt the room's ambiance. Use deep grays (e.g., \#121212) with high-contrast text.  
* **"Fat-Finger" Prevention:** Touch targets on a tablet should be a minimum of 48px by 48px, but for a clinical app where the user might be moving quickly, primary action buttons should be 60px or larger.  
* **Color as Status, Not Decoration:** \* **Red:** Only used for critical danger (e.g., QTc \> 500ms).  
  * **Yellow/Amber:** Warnings (e.g., T-wave flattening, dose approaching max threshold).  
  * **Blue/Green:** Normal vitals and stable readings.  
  * **Muted Gray:** Historical data or inactive UI elements.

---

### **2\. The Screen Layout Blueprint (Landscape)**

Divide the tablet screen into distinct, rigid zones. Do not hide primary information behind clicks or scrolls.

**Top Bar: Persistent Status Header (10% of screen height)**

* **Left:** Patient Initials/ID, Current Weight (used for active mg/kg math).  
* **Center:** Session Timer (HH:MM:SS) showing elapsed time since the first dose.  
* **Right:** Global Status Indicator (Green "Stable", Yellow "Caution", Red "Alert").

**Left Column: The "Heads-Up" Cardiac & Vitals Dashboard (40% of screen width)**

* *This zone is read-only and features massive typography.*  
* **Top Block (The Lifeline):** The QTc reading in huge text (e.g., 72pt). Below it, a smaller text indicating the formula used (e.g., *Fridericia*). A trend arrow (↑ or ↓) showing changes from the last reading.  
* **Middle Block (Vitals):** Heart Rate, Blood Pressure, and Respiratory rate in a 2x2 grid.  
* **Bottom Block (Pharmacology Load):** Large numbers showing "Total Session Dose: 600mg" and the critical "Ratio: 8.0 mg/kg".

**Right Column: The Action & Audit Zone (60% of screen width)**

* **Top Half (Data Entry):** The primary buttons for interaction:  
  * \[ \+ Log Vitals \]  
  * \[ \+ Administer Dose \]  
  * \[ \+ Flag Morphology \]  
* **Bottom Half (The Timeline):** A vertically scrolling table of the session. Columns: *Time, Event (Dose/Vitals), Details, QTc*. The newest entries must always appear at the top.

**Floating Action Button (FAB) / Side Rail: The AI Assistant**

* A persistent, easily accessible circular button in the bottom-right corner (or a collapsible right-side drawer) specifically for the **Drug Interaction Search**.

---

### **3\. Component Best Practices**

#### **A. Data Entry (Avoid the Native Keyboard)**

Typing on an iPad's native pop-up keyboard blocks half the screen and causes context loss.

* **Use Custom Numpads:** When the user taps \[ \+ Log Vitals \], bring up a modal with a custom, oversized 10-key numeric pad.  
* **Use Steppers:** For quick adjustments (e.g., respiratory rate going from 14 to 15), use \[ \- \] \[ 15 \] \[ \+ \]stepper components instead of making them type the number.

#### **B. Buttons & Critical Actions**

* **Primary Action (Logging):** Large, solid-fill buttons.  
* **High-Risk Actions:** If a doctor enters an unusually high dose, do not use a standard tap to submit. Use a **"Swipe to Confirm"** slider or a **"Hold for 3 Seconds"** button to prevent accidental overdoses in the log.

#### **C. Accordions & Modals (Use with Extreme Caution)**

* **Intra-session data must NEVER be in an accordion.** You do not want a doctor trying to remember where the latest blood pressure reading is hidden.  
* **When to use Accordions:** Use them for *Pre-session* or *Post-session* data. For example, the patient's baseline 12-lead ECG, comprehensive medication history, and baseline electrolytes can be collapsed in an accordion because they are reference materials, not real-time telemetry.  
* **When to use Modals (Pop-ups):** Use modals strictly for focused, linear tasks like entering a new dose. The modal should dim the background, command 100% of the attention, require the exact inputs (Substance type, mg), and then disappear immediately.

#### **D. Morphology Checkboxes (Fast Toggles)**

When the doctor notices an ECG anomaly, they shouldn't have to type it out. In the "Log Vitals" modal, include large, easily tappable toggle switches or chips for:

* \[ \] Sinus Bradycardia  
* \[ \] T-Wave Flattening  
* \[ \] Notched T-Wave  
* \[ \] Prolonged Tpeak-Tend

### **4\. Designing the Floating AI Resource**

Because they need to check for CYP2D6 interactions quickly:

* Make it a "slide-over" drawer rather than a full-screen page. When tapped, it slides in from the right edge, covering only 30% of the screen.  
* This allows the doctor to keep an eye on the QTc and Vitals on the left side of the screen while typing "Fluoxetine" into the interaction search on the right side.

Would you like me to translate this layout into a **Tailwind CSS component wireframe** or provide specific CSS class recommendations for your developers to achieve this dark-mode medical UI?

YES

Here is the structural blueprint translated into React and Tailwind CSS. This provides the exact skeleton for the layout we discussed, utilizing a true dark mode (\#121212 background) to reduce eye strain in a clinical setting, with high-contrast UI elements and massively oversized touch targets for "fat-finger" prevention.  
Your React developers can drop this directly into their main view component to establish the grid and styling immediately.

### **The React \+ Tailwind Skeleton**

JavaScript

```
import React, { useState } from 'react';

export default function ClinicalSessionDashboard() {
  // State for the AI slide-over drawer
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);

  return (
    // GLOBAL WRAPPER: Strict viewport height, true dark mode background, prevents accidental scrolling
    <div className="h-screen w-screen overflow-hidden bg-[#121212] text-gray-100 font-sans flex flex-col">
      
      {/* 1. TOP BAR: Persistent Status Header (h-16 = ~64px touch target area) */}
      <header className="h-20 w-full bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold">
            PT
          </div>
          <div>
            <h1 className="text-xl font-semibold">Patient: 3382</h1>
            <p className="text-sm text-gray-400">Baseline Weight: 75kg</p>
          </div>
        </div>
        
        {/* Session Timer - Monospaced for readability */}
        <div className="text-center">
          <p className="text-sm text-gray-400 uppercase tracking-widest">Elapsed Time</p>
          <p className="text-3xl font-mono font-bold tracking-tight">03:45:12</p>
        </div>

        {/* Global Status */}
        <div className="flex items-center space-x-3 bg-green-900/30 px-4 py-2 rounded-lg border border-green-800/50">
          <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-green-400 font-medium uppercase tracking-wide">Stable</span>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA: Split into Left (40%) and Right (60%) */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6">
        
        {/* LEFT COLUMN: Read-Only "Heads-Up" Display */}
        <section className="w-2/5 flex flex-col gap-6 h-full">
          
          {/* Critical Cardiac Block - Massive Typography */}
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50 flex flex-col items-center justify-center relative">
            <h2 className="absolute top-4 left-6 text-gray-400 font-semibold uppercase tracking-wider text-sm">QTc Interval</h2>
            {/* If > 500ms, change text-white to text-red-500 */}
            <div className="text-[120px] leading-none font-bold text-white tracking-tighter mt-4">
              453
            </div>
            <div className="flex space-x-4 items-center mt-2">
              <span className="text-gray-400 text-lg">ms</span>
              <span className="bg-gray-700 px-3 py-1 rounded text-sm text-gray-300">Fridericia</span>
              <span className="text-red-400 font-bold text-xl flex items-center">↑ 43</span> {/* Delta from baseline */}
            </div>
          </div>

          {/* Vitals Grid - 2x2 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Heart Rate</p>
              <p className="text-5xl font-bold text-blue-400">58 <span className="text-lg text-gray-500">bpm</span></p>
            </div>
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Blood Pressure</p>
              <p className="text-4xl font-bold text-white">135<span className="text-gray-500">/85</span></p>
            </div>
          </div>

          {/* Pharmacology Load */}
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 mt-auto">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Session Pharmacology</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-4xl font-bold text-purple-400">600 <span className="text-lg text-gray-500">mg</span></p>
                <p className="text-sm text-gray-400">Total Administered</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-purple-400">8.0 <span className="text-lg text-gray-500">mg/kg</span></p>
                <p className="text-sm text-gray-400">Current Ratio</p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Actions & Timeline */}
        <section className="w-3/5 flex flex-col h-full bg-gray-800/30 rounded-3xl border border-gray-700/30 overflow-hidden">
          
          {/* Action Buttons Container (Fat-finger friendly, min-height 80px) */}
          <div className="grid grid-cols-2 gap-4 p-6 border-b border-gray-700/50 shrink-0">
            <button className="h-24 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl text-2xl font-semibold text-white transition-colors shadow-lg shadow-blue-900/20">
              + Log Vitals
            </button>
            <button className="h-24 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 rounded-xl text-2xl font-semibold text-white transition-colors shadow-lg shadow-purple-900/20">
              + Administer Dose
            </button>
          </div>

          {/* Scrolling Timeline/Log */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-4 sticky top-0 bg-[#151515] py-2 z-10">Session Log</h3>
            
            {/* Example Log Item - Dose */}
            <div className="bg-gray-800/80 rounded-xl p-5 border-l-4 border-purple-500 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400 font-mono">14:30:00</span>
                <span className="text-xl font-semibold mt-1">Dose Administered: TPA</span>
                <span className="text-gray-300 mt-1">200mg (Est. Active: 160mg)</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-sm">Ratio Jump</span>
                <p className="text-xl font-bold text-purple-400">+ 2.13 mg/kg</p>
              </div>
            </div>

            {/* Example Log Item - Vitals Alert */}
            <div className="bg-gray-800/80 rounded-xl p-5 border-l-4 border-yellow-500 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400 font-mono">14:45:00</span>
                <span className="text-xl font-semibold mt-1 text-yellow-400">Morphology Flagged</span>
                <span className="text-gray-300 mt-1">T-Wave Notching Observed. HR dropping (58bpm).</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-sm">QTc at log</span>
                <p className="text-xl font-bold text-white">453 ms</p>
              </div>
            </div>
            
          </div>
        </section>
      </main>

      {/* FLOATING ACTION BUTTON (FAB) for AI Pharmacology Search */}
      <button 
        onClick={() => setIsAiDrawerOpen(true)}
        className="fixed bottom-8 right-8 h-20 w-20 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 border-4 border-gray-900 z-50"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Slide-over Drawer (AI Assistant) - Simplified for example */}
      {isAiDrawerOpen && (
        <div className="fixed inset-y-0 right-0 w-1/3 bg-gray-900 border-l border-gray-700 shadow-2xl z-50 transform transition-transform p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-indigo-400">Drug Interactions (CYP2D6)</h2>
            <button onClick={() => setIsAiDrawerOpen(false)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
          <input 
            type="text" 
            placeholder="Search substance (e.g., Fluoxetine)..." 
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 text-white text-lg focus:outline-none focus:border-indigo-500"
          />
          {/* AI Results would populate here */}
        </div>
      )}

    </div>
  );
}
```

### **Key Developer Notes for Tailwind Classes Used:**

1. **Typography Over-Sizing:** The QTc reading uses text-\[120px\]. This is completely non-standard for consumer web design, but absolutely mandatory for "glanceable" medical software where the screen might be 4-6 feet away from the doctor.  
2. **Hit Areas (h-24):** Buttons are set to a height of 24 (96px). When someone's fine motor skills are compromised by stress or they are glancing away, large hit areas prevent misclicks.  
3. **Contrast and Borders (bg-gray-800/50, border-gray-700/50):** Pure black \#000 against bright white text creates a halo effect and astigmatism flare. By layering \#121212 backgrounds with slightly lighter slate grays and thin borders, we group information logically without relying on blinding white card backgrounds.

