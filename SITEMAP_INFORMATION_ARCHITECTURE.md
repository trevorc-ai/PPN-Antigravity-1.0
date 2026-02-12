# 🗺️ PPN PORTAL SITEMAP & INFORMATION ARCHITECTURE
## Complete Site Structure & Navigation Plan

**Created By:** LEAD  
**Date:** 2026-02-12 04:00 PST  
**Purpose:** Comprehensive sitemap for PPN Portal (public + authenticated)

---

## 🎯 SITE STRUCTURE OVERVIEW

### **Two Main Sections:**
1. **Public Site** (Marketing, education, signup)
2. **Authenticated App** (Dashboard, tools, analytics)

---

## 📱 PUBLIC SITE (Marketing & Signup)

### **1. Homepage** (`/`)
- Hero: "The Clinical Intelligence Platform for Psychedelic Therapy"
- Value props: No PHI, Network Benchmarking, Evidence-Based
- CTA: "Try Interaction Checker Free" (no signup)
- Social proof: "14 sites, 10,247 protocols"
- Features overview
- Pricing preview
- Testimonials
- FAQ preview (top 5 questions)

### **2. Features** (`/features`)
- **Interaction Checker** (free tier)
- **Protocol Builder** (Solo tier)
- **Safety Surveillance** (Clinic tier)
- **Network Benchmarking** (Network tier)
- **Compliance Reporting** (all tiers)

### **3. Pricing** (`/pricing`)
- **Free Tier:** Interaction Checker
- **Solo ($49/month):** Protocol Builder + Safety Surveillance
- **Clinic ($149/month):** Multi-practitioner + Benchmarking
- **Network ($499/month):** Multi-site + White-label
- FAQ: "Can I upgrade later?" "What if I cancel?"
- CTA: "Start Free Trial" (14 days)

### **4. Use Cases** (`/use-cases`)
- **Overview:** 5 use cases
- **Use Case 1:** "Prove You're Not Reckless" (`/use-cases/prove-safety`)
- **Use Case 2:** "Reduce Malpractice Exposure" (`/use-cases/reduce-malpractice`)
- **Use Case 3:** "Get Reimbursement Approved" (`/use-cases/get-reimbursement`)
- **Use Case 4:** "Scale Without Quality Collapse" (`/use-cases/scale-quality`)
- **Use Case 5:** "Comply With State Regulations" (`/use-cases/comply-regulations`)

### **5. Why No PHI** (`/why-no-phi`)
- **Legal Protection:** Zero HIPAA breach risk
- **Financial Savings:** $1.7M saved over 5 years
- **Privacy Advantages:** Network benchmarking enabled
- **Competitive Advantage:** Osmind can't do this
- **FAQ:** "Don't we need PHI?" "What about subpoenas?"

### **6. About** (`/about`)
- **Mission:** Clinical intelligence for psychedelic therapy
- **Team:** Founder bio, advisors
- **Story:** Why we built PPN
- **Values:** Safety, evidence, privacy
- **Contact:** Email, social media

### **7. Resources** (`/resources`)
- **Blog:** Articles, case studies, safety data
- **Knowledge Base:** How-to guides, FAQs
- **Research:** Network safety reports, benchmarks
- **Partners:** MAPS, Multidisciplinary Association, Numinus

### **8. FAQ** (`/faq`)
- **General:** "What is PPN Portal?" "Who is this for?"
- **Privacy:** "Do you collect PHI?" "What about patient data?"
- **Pricing:** "Can I cancel?" "What if I upgrade?"
- **Features:** "What's included in each tier?"
- **Compliance:** "Is this HIPAA compliant?" "What about state regs?"

### **9. Login/Signup** (`/login`, `/signup`)
- **Login:** Email + password
- **Signup:** Email + password (no credit card for free tier)
- **Social login:** Google (optional)
- **Forgot password:** Reset link

### **10. Legal** (`/legal`)
- **Privacy Policy** (`/legal/privacy`)
- **Terms of Service** (`/legal/terms`)
- **Data Processing Agreement** (`/legal/dpa`)
- **Cookie Policy** (`/legal/cookies`)

---

## 🔐 AUTHENTICATED APP (Dashboard & Tools)

### **1. Dashboard** (`/dashboard`)
- **Welcome:** "Welcome back, Dr. Smith"
- **Quick stats:** Protocols logged, safety score, network percentile
- **Recent activity:** Last 5 protocols
- **Quick actions:** "Log Protocol," "Check Interaction," "View Reports"
- **Alerts:** "Denver site: 4.2% adverse events (attention needed)"

### **2. Interaction Checker** (`/interaction-checker`)
- **Free tier:** Available to all users
- **Input:** Substance 1, Substance 2
- **Output:** Risk level (low, medium, high), explanation, references
- **History:** Past checks (saved for logged-in users)

### **3. Protocol Builder** (`/protocol-builder`)
- **Solo tier and above**
- **Multi-step form:** Subject info, intervention, outcomes, safety
- **Autosave:** Draft protocols saved automatically
- **Submit:** Log protocol to database
- **Post-submission:** Export PDF, email copy, print

### **4. Safety Surveillance** (`/safety`)
- **Solo tier and above**
- **Safety Score:** Gauge chart (0-100)
- **Adverse Events:** List of logged events
- **Trends:** Chart showing adverse events over time
- **Alerts:** "3 adverse events in last 30 days (above average)"

### **5. Network Benchmarking** (`/benchmarking`)
- **Clinic tier and above**
- **Your Performance:** Safety score, adverse event rate
- **Network Comparison:** Percentile rank, network average
- **Insights:** "Your rate: 2.3% (better than 62% of network)"
- **Filters:** By substance, route, indication

### **6. Compliance Reporting** (`/compliance`)
- **All tiers**
- **Generate Report:** Select date range, export format (PDF, Excel)
- **Report Preview:** "Q1 2026: 127 sessions, 3 adverse events, 97.6% score"
- **Export:** One-click download
- **History:** Past reports

### **7. Analytics** (`/analytics`)
- **Clinic tier and above**
- **Protocol Trends:** Chart showing protocols over time
- **Substance Breakdown:** Pie chart (psilocybin, ketamine, MDMA)
- **Outcome Metrics:** Efficacy scores, patient satisfaction
- **Custom Reports:** Build your own analytics

### **8. Settings** (`/settings`)
- **Profile:** Name, email, credentials, photo
- **Practice:** Practice name, location, license number
- **Billing:** Payment method, invoices, upgrade/downgrade
- **Notifications:** Email preferences, alerts
- **Team:** Add/remove practitioners (Clinic tier)
- **API:** API keys, webhooks (Network tier)

### **9. Help** (`/help`)
- **Knowledge Base:** Search articles, how-to guides
- **Video Tutorials:** 2-minute walkthroughs
- **Contact Support:** Email, chat (Clinic tier and above)
- **Feature Requests:** Submit ideas, vote on roadmap

### **10. Account** (`/account`)
- **Subscription:** Current plan, usage, upgrade/downgrade
- **Billing:** Payment method, invoices, billing history
- **Team:** Manage team members (Clinic tier)
- **Data Export:** Download all your data (CSV, JSON)
- **Delete Account:** Permanent deletion (with confirmation)

---

## 🔗 NAVIGATION STRUCTURE

### **Public Site Header:**
```
Logo | Features | Pricing | Use Cases | Why No PHI | About | Resources | Login | Sign Up
```

### **Authenticated App Header:**
```
Logo | Dashboard | Interaction Checker | Protocol Builder | Safety | Benchmarking | Compliance | Analytics | [User Menu]
```

### **User Menu (Dropdown):**
```
Profile
Settings
Help
Billing
Logout
```

### **Footer (Public Site):**
```
Product:              Company:           Resources:         Legal:
- Features            - About            - Blog             - Privacy
- Pricing             - Team             - Knowledge Base   - Terms
- Use Cases           - Contact          - Research         - DPA
- Why No PHI          - Careers          - Partners         - Cookies

Social: LinkedIn | Twitter | Email
```

### **Footer (Authenticated App):**
```
Help | Settings | Privacy | Terms | Status | API Docs
```

---

## 📊 SITEMAP.XML (SEO)

### **Priority Pages (Priority 1.0):**
- `/` (Homepage)
- `/features` (Features)
- `/pricing` (Pricing)
- `/signup` (Signup)

### **High Priority (Priority 0.8):**
- `/use-cases` (Use Cases overview)
- `/use-cases/prove-safety`
- `/use-cases/reduce-malpractice`
- `/use-cases/get-reimbursement`
- `/use-cases/scale-quality`
- `/use-cases/comply-regulations`
- `/why-no-phi` (Why No PHI)

### **Medium Priority (Priority 0.6):**
- `/about` (About)
- `/resources` (Resources)
- `/faq` (FAQ)
- `/blog` (Blog index)
- `/blog/*` (Individual blog posts)

### **Low Priority (Priority 0.4):**
- `/legal/privacy` (Privacy Policy)
- `/legal/terms` (Terms of Service)
- `/legal/dpa` (DPA)
- `/legal/cookies` (Cookie Policy)

### **Excluded from Sitemap:**
- `/login` (No SEO value)
- `/dashboard` (Authenticated, no SEO)
- All authenticated app pages (no SEO)

---

## 🎨 URL STRUCTURE (SEO-Friendly)

### **Best Practices:**
- Use hyphens (not underscores): `/use-cases` not `/use_cases`
- Lowercase only: `/pricing` not `/Pricing`
- No trailing slashes: `/features` not `/features/`
- Descriptive slugs: `/use-cases/prove-safety` not `/uc1`

### **Examples:**
```
✅ Good: /use-cases/reduce-malpractice
❌ Bad: /use_case_2

✅ Good: /why-no-phi
❌ Bad: /whynophi

✅ Good: /blog/network-safety-report-q1-2026
❌ Bad: /blog/post123
```

---

## 🔍 SEO METADATA (Per Page)

### **Homepage (`/`):**
- **Title:** "PPN Portal: Clinical Intelligence for Psychedelic Therapy"
- **Description:** "Network benchmarking, safety surveillance, and compliance reporting for ketamine clinics and psilocybin facilitators. No PHI, no seizure risk."
- **Keywords:** "psychedelic therapy software, ketamine clinic software, psilocybin compliance, clinical intelligence"

### **Pricing (`/pricing`):**
- **Title:** "Pricing - PPN Portal"
- **Description:** "Free Interaction Checker. Solo ($49/month), Clinic ($149/month), Network ($499/month). 14-day free trial."
- **Keywords:** "psychedelic therapy pricing, ketamine clinic software cost"

### **Use Cases (`/use-cases`):**
- **Title:** "Use Cases - PPN Portal"
- **Description:** "5 ways practitioners use PPN: Prove safety, reduce malpractice, get reimbursement, scale quality, comply with regulations."
- **Keywords:** "psychedelic therapy use cases, ketamine clinic safety, psilocybin compliance"

---

## 📱 MOBILE NAVIGATION

### **Mobile Header (Hamburger Menu):**
```
☰ Menu

[Expanded Menu:]
- Home
- Features
- Pricing
- Use Cases
- Why No PHI
- About
- Resources
- Login
- Sign Up
```

### **Mobile App (Bottom Nav):**
```
[Dashboard] [Protocol] [Safety] [More]

[More Menu:]
- Benchmarking
- Compliance
- Analytics
- Settings
- Help
```

---

## 🚀 IMPLEMENTATION PRIORITY

### **Phase 1 (MVP - Launch):**
1. ✅ Homepage (`/`)
2. ✅ Features (`/features`)
3. ✅ Pricing (`/pricing`)
4. ✅ Login/Signup (`/login`, `/signup`)
5. ✅ Dashboard (`/dashboard`)
6. ✅ Interaction Checker (`/interaction-checker`)
7. ✅ Protocol Builder (`/protocol-builder`)

### **Phase 2 (Post-Launch):**
8. ✅ Use Cases (`/use-cases` + 5 individual pages)
9. ✅ Why No PHI (`/why-no-phi`)
10. ✅ Safety Surveillance (`/safety`)
11. ✅ Compliance Reporting (`/compliance`)
12. ✅ Settings (`/settings`)

### **Phase 3 (Growth):**
13. ✅ Network Benchmarking (`/benchmarking`)
14. ✅ Analytics (`/analytics`)
15. ✅ Resources/Blog (`/resources`, `/blog`)
16. ✅ About (`/about`)
17. ✅ FAQ (`/faq`)

### **Phase 4 (Scale):**
18. ✅ API Docs (`/api`)
19. ✅ Partner Directory (`/partners`)
20. ✅ Knowledge Base (`/help`)

---

**Status:** ✅ Sitemap plan complete  
**Next:** Implement sitemap.xml for SEO  
**Priority:** 🟢 MEDIUM - SEO optimization
