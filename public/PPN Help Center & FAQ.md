# **📚 PPN Help Center & FAQ**

## **1\. The Safety Shield (Drug Interaction Checker)**

**What is the Safety Shield?**

The Safety Shield is like a spell-checker for medicine. It looks at the substance you plan to use (like Psilocybin) and compares it against the medications your patient is already taking (like antidepressants). It warns you if combining them could be dangerous.

**What do the alert colors mean?**

* **Red (Stop):** This combination has a high risk of a severe reaction. You should strongly consider not proceeding.  
* **Yellow (Caution):** This combination might cause side effects or make the treatment less effective. Proceed with care.  
* **Green (Clear):** We did not find any known conflicts in our database.

**Glossary:**

* **Contraindication:** A medical reason *not* to use a specific treatment because it could be harmful.  
* **Interaction:** When two drugs change how the other one works.  
* **Serotonin Toxicity:** A dangerous condition caused by having too much serotonin in the brain, often from mixing certain drugs.

---

## **2\. Legacy Note Importer (The "Time Machine")**

**How do I use the Legacy Importer?**

If you have old session notes saved in Word documents or text files, you don't have to type them in one by one. Just copy the text and paste it into the importer. Our system reads the text and automatically finds the dates, dosages, and outcomes for you.

**Is my private client data safe?**

Yes. The "reading" happens right on your device (your computer or phone). The text is processed locally, meaning the private names and details are never sent to a cloud server until you approve the final, anonymous log.

**Glossary:**

* **Parse:** To read through text and pull out specific pieces of information, like finding a needle in a haystack.  
* **Unstructured Data:** Messy text, like a diary entry or a paragraph, that isn't organized into neat rows and columns.

---

## **3\. The Reagent Eye (Test Kit Verifier)**

**How does the Reagent Eye work?**

This tool uses your phone's camera to look at your chemical test strip. Because human eyes can be tricked by bad lighting, the app analyzes the exact color code (the "Hex Code") to see if it matches the expected color for a substance.

**Does this guarantee the substance is pure?**

No. This tool confirms that the *color reaction* is correct. It is a strong indicator, but it cannot detect every possible impurity. Always use your best judgment.

**Glossary:**

* **Reagent Test:** A chemical drop that changes color when it touches a specific drug.  
* **Spectrum:** The full range of colors that can be seen.  
* **False Positive:** When a test says "Yes" (it is safe), but it is actually "No" (unsafe).

---

## **4\. Trial Matchmaker (Recruitment Tool)**

**Why am I seeing a "Recruitment Opportunity" badge?**

This badge means one of your anonymous patient profiles matches the rules for a paid clinical research study. The study sponsors (research companies) are looking for patients just like yours.

**Does the research company know who my patient is?**

No. They only know that *you* have a patient who matches their needs. You are the only person who can see the patient's name. If you choose to participate, you ask the patient first.

**Glossary:**

* **Inclusion Criteria:** The checklist of rules a patient must meet to be allowed in a study (e.g., "Must be over 18" or "Must have anxiety").  
* **Clinical Trial:** A research study organized to test if a new treatment works and is safe.

---

## **5\. Music Logger (The Playlist Tracker)**

**Why should I log the music?**

Music sets the mood. By pasting a link to your playlist, we can track how fast or slow the music was during different parts of the session. Over time, this helps you see if certain songs help patients stay calm or if others cause stress.

**What is the "Heart Rate vs. BPM" chart?**

This chart shows two lines. One line is the patient's heart rate. The other line is the speed of the music (BPM).

* **X-Axis (The bottom line):** This represents time, from the start of the session to the end.  
* **Y-Axis (The side line):** This represents speed (beats per minute).  
* **Legend (The key):** The map key that tells you which color line is the Heart Rate and which is the Music.

**Glossary:**

* **BPM (Beats Per Minute):** A measure of how fast a song is. Higher numbers are faster and more energetic; lower numbers are slower and calmer.  
* **Set and Setting:** The mindset of the patient ("Set") and the physical environment ("Setting"), including music and lighting.

---

## **6\. The Research Dashboard (Search Results)**

**Why are the results separated into different boxes?**

Instead of a long list of mixed results, we organize them into a "Bento Grid" (like a lunchbox with dividers).

* **Top Box:** Substances (Drugs).  
* **Middle Box:** Patient Outcomes (Results).  
* **Bottom Box:** Network (Doctors).

**What are the tiny charts in the patient rows?**

Those are called **Sparklines**. They are mini-graphs that show a quick trend.

* **Left Side of line:** How the patient felt before treatment (Baseline).  
* **Right Side of line:** How they feel now.  
* If the line goes **down**, their symptoms (like depression) are decreasing. That is good\!

---

# **💡 Tooltip Copy (Implementation Ready)**

Use these short snippets inside your AdvancedTooltip components. They are written to be helpful without cluttering the screen.

### **🛡️ Safety Shield**

* **Interaction Check:** "We scan this combination against the FDA database to check for dangerous reactions."  
* **Mechanism:** "The biological reason why these two drugs clash (e.g., they both compete for the same receptor)."  
* **Severity Score:** "Red \= High Risk (Stop). Yellow \= Caution (Monitor closely)."

### **📝 Legacy Importer**

* **Paste Area:** "Copy the text from your old notes and paste it here. Do not worry about formatting."  
* **Review Step:** "Check the data below. If we guessed a date or dose wrong, click to edit it."  
* **Local Privacy:** "This text is processed on your device. It is not sent to the cloud until you click Save."

### **👁️ Reagent Eye**

* **Camera View:** "Center the test strip in the square. Ensure you are in bright, even lighting."  
* **Color Match:** "The percentage shows how closely your test strip matches the 'perfect' reaction color."  
* **Warning:** "If the color is murky or brownish, do not proceed."

### **🤝 Trial Matchmaker**

* **Match Badge:** "This patient fits the profile for a paid clinical trial. Click to view details."  
* **Payout:** "The estimated amount the study sponsor pays for a successful referral."  
* **Anon ID:** "Your patient is identified only by this code number to protect their privacy."

### **🎵 Music Logger**

* **Playlist Link:** "Paste the public link to your Spotify or Apple Music playlist here."  
* **Phase:** "Select which part of the session this music is for (e.g., Onset, Peak, Comedown)."  
* **Sync:** "We will try to match the song timing with your vital sign logs."

### **📊 Research Dashboard**

* **Sparkline:** "A mini-view of progress. Downward slope \= Symptoms improving."  
* **Efficacy Score:** "The percentage of patients who saw a significant benefit from this substance."  
* **Verified Node:** "This clinician has verified their license and identity with PPN."

