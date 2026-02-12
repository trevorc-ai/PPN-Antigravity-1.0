# 📚 HELP DOCUMENTATION & TOOLTIPS
## Complete Help Files for Analytics Features

**Created By:** LEAD  
**Date:** 2026-02-12 04:19 PST  
**Purpose:** Help documentation and tooltip text for all analytics features

---

## 🎯 HELP FILE STRUCTURE

### **Location:** `/help` page in authenticated app

### **Categories:**
1. **Getting Started** (onboarding)
2. **Protocol Builder** (how to log protocols)
3. **Safety Surveillance** (understanding safety scores)
4. **Network Benchmarking** (comparing to network)
5. **Compliance Reporting** (generating reports)
6. **Analytics** (understanding charts)
7. **Settings** (account management)
8. **FAQ** (common questions)

---

## 📖 1. GETTING STARTED

### **Help Article: "Welcome to PPN Portal"**

**Title:** Welcome to PPN Portal  
**Category:** Getting Started  
**Reading Time:** 2 minutes

**Content:**
```markdown
# Welcome to PPN Portal

PPN Portal is the clinical intelligence platform for psychedelic therapy practitioners.

## What You Can Do

### Free Tier
- **Interaction Checker:** Check drug interactions (psilocybin + SSRIs, ketamine + benzodiazepines, etc.)

### Solo Tier ($49/month)
- **Protocol Builder:** Log treatment protocols
- **Safety Surveillance:** Track adverse events and safety scores
- **Compliance Reporting:** Generate quarterly reports for state regulators

### Clinic Tier ($149/month)
- Everything in Solo, plus:
- **Network Benchmarking:** Compare your safety scores to the network
- **Multi-practitioner:** Add team members
- **Advanced Analytics:** Custom reports and insights

### Network Tier ($499/month)
- Everything in Clinic, plus:
- **Multi-site:** Manage multiple locations
- **White-label:** Custom branding (portal.yourpractice.com)
- **API Access:** Integrate with your EHR

## Quick Start

1. **Try Interaction Checker** (no signup required)
2. **Create free account** (30 seconds)
3. **Log your first protocol** (2 minutes)
4. **View your safety score** (instant)
5. **Upgrade to unlock benchmarking** (14-day free trial)

## Need Help?

- **Knowledge Base:** Search 50+ articles
- **Video Tutorials:** 2-minute walkthroughs
- **Email Support:** support@ppnportal.com (Clinic tier and above)
- **Live Chat:** Available for Clinic and Network tiers

---

**Next:** [How to Log Your First Protocol →](#)
```

---

## 📖 2. PROTOCOL BUILDER

### **Help Article: "How to Log a Protocol"**

**Title:** How to Log a Protocol  
**Category:** Protocol Builder  
**Reading Time:** 3 minutes

**Content:**
```markdown
# How to Log a Protocol

Protocol Builder lets you document treatment protocols in 2 minutes.

## What Gets Logged

- **Subject Info:** Age, sex, smoking status (no patient identifiers)
- **Intervention:** Substance, dose, route, session number
- **Outcomes:** Efficacy scores, patient satisfaction
- **Safety:** Adverse events, severity, resolution

**Important:** We don't collect patient names, DOB, addresses, or any PHI. This is by design (enables network benchmarking).

## Step-by-Step

### Step 1: Subject Information
- **Age:** Enter age in years (e.g., 35)
- **Sex:** Select: Male, Female, Other, Prefer not to say
- **Smoking Status:** Never, Former, Current

**Why we ask:** Age and smoking affect adverse event risk.

### Step 2: Intervention
- **Substance:** Select from dropdown (psilocybin, ketamine, MDMA, etc.)
- **Dose:** Enter dose with units (e.g., 25mg, 0.5mg/kg)
- **Route:** Oral, sublingual, IV, IM, intranasal
- **Session Number:** 1st session, 2nd session, etc.
- **Session Date:** Select date (used for trend analysis)

**Why we ask:** Dose and route affect efficacy and safety.

### Step 3: Outcomes
- **Efficacy Score:** 0-10 (0 = no effect, 10 = complete resolution)
- **Patient Satisfaction:** 0-10 (0 = very dissatisfied, 10 = very satisfied)

**Why we ask:** Tracks treatment effectiveness.

### Step 4: Safety
- **Adverse Events:** Select all that apply (nausea, anxiety, etc.)
- **Severity:** Mild, Moderate, Severe, Life-threatening
- **Resolution:** Resolved, ongoing, required intervention

**Why we ask:** Tracks safety and calculates your safety score.

### Step 5: Submit
- Click "Submit Protocol"
- Protocol is saved to your account
- Safety score updates automatically

## After Submission

You'll see a confirmation screen with options to:
- **Export PDF:** Download protocol as PDF
- **Email Copy:** Send to your email
- **Print:** Print for your records
- **Log Another:** Log next protocol

## Tips

- **Log protocols immediately** (don't wait until end of day)
- **Be accurate** (your safety score depends on it)
- **Don't skip adverse events** (even mild ones matter)
- **Use session numbers** (helps track patient progress)

---

**Next:** [Understanding Your Safety Score →](#)
```

---

## 📖 3. SAFETY SURVEILLANCE

### **Help Article: "Understanding Your Safety Score"**

**Title:** Understanding Your Safety Score  
**Category:** Safety Surveillance  
**Reading Time:** 4 minutes

**Content:**
```markdown
# Understanding Your Safety Score

Your safety score is calculated from your adverse event rate.

## How It's Calculated

```
Safety Score = 100 - (Adverse Event Rate × 10)

Where:
Adverse Event Rate = (Total Adverse Events / Total Protocols) × 100
```

### Example:
- Total Protocols: 127
- Total Adverse Events: 3
- Adverse Event Rate: 2.36%
- **Safety Score: 76/100**

## Score Ranges

- **90-100 (Excellent):** 0-1% adverse events
- **75-89 (Good):** 1.1-2.5% adverse events
- **60-74 (Fair):** 2.6-4% adverse events
- **<60 (Poor):** >4% adverse events

## What Counts as an Adverse Event?

Any unwanted effect, including:
- **Mild:** Nausea, headache, mild anxiety
- **Moderate:** Vomiting, panic attack, elevated blood pressure
- **Severe:** Psychotic episode, seizure, hospitalization
- **Life-threatening:** Cardiac arrest, respiratory failure

**Important:** Even mild events count. This is intentional (better to over-report than under-report).

## Why Your Score Matters

### For You:
- Track your safety performance over time
- Identify patterns (e.g., higher events with certain substances)
- Improve protocols based on data

### For Regulators:
- Oregon and Colorado require quarterly safety reports
- Your safety score is included in compliance reports
- Scores <60 may trigger regulatory review

### For Insurance:
- Malpractice insurers may request safety data
- Higher scores = lower premiums
- Scores >90 demonstrate standard-of-care compliance

### For Patients:
- Patients can ask to see your safety score
- Higher scores = more confidence in your practice
- Transparency builds trust

## How to Improve Your Score

1. **Screen patients carefully** (contraindications, medications)
2. **Use appropriate doses** (start low, go slow)
3. **Provide integration support** (reduce psychological adverse events)
4. **Monitor vitals** (catch physiological events early)
5. **Document everything** (even mild events)

## Common Questions

**Q: My score is 62. Is that bad?**  
A: Fair range (60-74). Not bad, but room for improvement. Review your protocols and see if there are patterns.

**Q: I had 1 severe event. Will my score tank?**  
A: Depends on total protocols. If you have 100 protocols, 1 event = 1% rate = 90 score (still excellent). If you have 10 protocols, 1 event = 10% rate = 0 score (poor).

**Q: Should I avoid logging adverse events to keep my score high?**  
A: **NO.** This is unethical and defeats the purpose. Accurate reporting helps everyone (you, patients, regulators, the field).

---

**Next:** [Network Benchmarking Explained →](#)
```

---

## 📖 4. NETWORK BENCHMARKING

### **Help Article: "Network Benchmarking Explained"**

**Title:** Network Benchmarking Explained  
**Category:** Network Benchmarking  
**Reading Time:** 3 minutes

**Content:**
```markdown
# Network Benchmarking Explained

Network benchmarking compares your safety performance to other practitioners in the PPN network.

## How It Works

### Your Data:
- Your adverse event rate: 2.3%
- Your safety score: 77/100

### Network Data (Aggregated):
- Network average rate: 3.1%
- Network average score: 69/100
- Total sites: 14

### Your Percentile:
- Sites worse than you: 11
- Sites better than you: 2
- **Your percentile: 79th**
- **Message: "Better than 79% of network"**

## What This Means

- **79th percentile = Top 21%** (you're performing well)
- **50th percentile = Average** (middle of the pack)
- **25th percentile = Bottom 25%** (needs improvement)

## Why Benchmarking Matters

### For You:
- Know where you stand vs. peers
- Identify if your protocols are safer or riskier
- Set improvement goals (e.g., "reach 90th percentile")

### For Patients:
- Patients can ask: "How do you compare to other practitioners?"
- You can say: "I'm in the top 21% for safety"
- Builds confidence and trust

### For Insurance:
- Malpractice insurers want to see benchmarking data
- Top performers get lower premiums
- Bottom performers may face higher rates or non-renewal

### For Regulators:
- Oregon and Colorado may require benchmarking data
- Demonstrates you're meeting or exceeding standards
- Outliers (top or bottom 10%) may face additional scrutiny

## How to Use Benchmarking

### If You're Above Average (>50th percentile):
- **Celebrate!** You're doing well
- **Share:** Mention it in marketing ("Top 20% for safety")
- **Maintain:** Keep doing what you're doing

### If You're Average (40-60th percentile):
- **Improve:** Review protocols, identify patterns
- **Learn:** See what top performers are doing differently
- **Track:** Monitor your percentile over time

### If You're Below Average (<40th percentile):
- **Investigate:** Why are your rates higher?
- **Adjust:** Change protocols, screening, or support
- **Seek help:** Consult with top performers or advisors

## Privacy & Anonymity

- **Your data is de-identified** (no patient names, no site names)
- **Network sees aggregate data only** (no individual site data)
- **You see your own percentile** (but not other sites' scores)

**This is why we don't collect PHI:** It enables cross-site benchmarking without privacy risk.

---

**Next:** [Generating Compliance Reports →](#)
```

---

## 🏷️ TOOLTIPS SPECIFICATIONS

### **Tooltip Guidelines:**
- **Length:** 1-2 sentences max
- **Tone:** Helpful, not condescending
- **Font Size (Mobile):** 10px minimum (exception to 12px rule)
- **Placement:** Above or below element (never cover important content)
- **Trigger:** Hover (desktop) or tap icon (mobile)

---

### **Safety Score Gauge Tooltip:**
```
Safety Score (0-100)

Calculated from your adverse event rate. 
Higher is better. 90+ is excellent.
```

### **Adverse Event Rate Tooltip:**
```
Adverse Event Rate

Percentage of protocols with adverse events.
Lower is better. Network average: 3.1%
```

### **Percentile Rank Tooltip:**
```
Percentile Rank

Your position vs. other practitioners.
79th percentile = better than 79% of network.
```

### **Network Average Tooltip:**
```
Network Average

Average adverse event rate across all 14 sites.
Used for benchmarking your performance.
```

### **Severity Grade Tooltip:**
```
Severity Grade

Mild: No intervention needed
Moderate: Required monitoring
Severe: Required medical intervention
Life-threatening: ICU or hospitalization
```

### **Session Number Tooltip:**
```
Session Number

Which session is this for the patient?
(1st, 2nd, 3rd, etc.)
Helps track progress over time.
```

### **Efficacy Score Tooltip:**
```
Efficacy Score (0-10)

Patient-reported symptom improvement.
0 = no effect, 10 = complete resolution.
```

### **Compliance Status Tooltip:**
```
Compliance Status

✅ Compliant: Meets state requirements
⚠️ Needs Attention: Review protocols
🔴 Non-Compliant: Contact support
```

### **Export PDF Tooltip:**
```
Export PDF

Download this protocol as a PDF.
Useful for patient records or compliance.
```

### **Email Copy Tooltip:**
```
Email Copy

Send this protocol to your email.
Useful for backup or sharing with team.
```

---

## 📱 MOBILE FONT SIZE EXCEPTION

### **Updated Mobile Font Guidelines:**

**Standard Text:**
- Heading 1: 24px
- Heading 2: 20px
- Body: 16px
- Small: 14px
- Minimum: 12px

**Exceptions (Mobile Only):**
- **Chart labels:** 10px (e.g., "Week 1", "2.3%")
- **Chart legends:** 10px (e.g., "Your Rate", "Network Avg")
- **Tooltips:** 10px (brief explanatory text)
- **Table headers (dense tables):** 11px

**Rationale:** Mobile screens are viewed closer (~12 inches) vs. desktop (~24 inches), so smaller fonts are more readable on mobile.

**Accessibility:** Ensure sufficient contrast (4.5:1 minimum) for all text, especially small text.

---

**Status:** ✅ Help files and tooltips complete  
**Next:** DESIGNER implements tooltips using AdvancedTooltip component  
**Priority:** 🟡 HIGH - Improves UX and reduces support requests
