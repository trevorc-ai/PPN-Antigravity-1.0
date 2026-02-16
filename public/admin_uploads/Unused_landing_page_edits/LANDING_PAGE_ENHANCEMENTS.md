# 🎨 LANDING PAGE ENHANCEMENTS
**Date:** February 9, 2026 20:36 PST  
**Purpose:** Veterans section redesign + button consistency + registration page  
**Priority:** Add to launch batch (BATCH 3 extension)

---

## 🎖️ **ENHANCEMENT 1: Veterans PTSD Section Redesign**

### **Current Issue:**
- Veterans section feels like an afterthought
- Buried at bottom of About PPN section
- Small, understated presentation
- Doesn't reflect the importance of this commitment

### **New Vision:**
Move Veterans section to be its own **Hero Section** between Bento Box and About PPN, with premium presentation worthy of this critical mission.

---

### **New Veterans Section Design:**

**Location:** Insert AFTER Bento Box, BEFORE About PPN

**Visual Concept:**
```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  [Dark gradient background with American flag subtle overlay]║
║                                                               ║
║     🎖️ [Military badge icon - large, gold]                   ║
║                                                               ║
║              Supporting Our Veterans                          ║
║                                                               ║
║    A Commitment to Those Who Served                          ║
║                                                               ║
║  We are committed to supporting veterans with PTSD through   ║
║  evidence-based psychedelic therapy research. A portion of   ║
║  our network's de-identified data contributes to             ║
║  VA-partnered studies on MDMA-assisted therapy and           ║
║  psilocybin for treatment-resistant PTSD.                    ║
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  "After 15 years of failed treatments, psychedelic-      │ ║
║  │   assisted therapy gave me my life back."                │ ║
║  │                                    — Marine Veteran, 2024│ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  [Learn More About Our Veterans Initiative] [CTA Button]     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

### **Implementation Code:**

**File:** `src/pages/Landing.tsx`

**Step 1:** Remove old Veterans section from About PPN (currently around line 745-760)

**Step 2:** Add new Veterans Hero Section (insert after Bento Box, before About PPN)

```tsx
{/* SECTION: Veterans PTSD Initiative */}
<section className="py-32 px-6 relative z-10 overflow-hidden">
  <div className="max-w-7xl mx-auto">
    {/* Background gradient with subtle flag pattern */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950/40 pointer-events-none"></div>
    <div className="absolute inset-0 opacity-[0.03]" style={{ 
      backgroundImage: 'repeating-linear-gradient(0deg, #1e40af 0px, #1e40af 2px, transparent 2px, transparent 40px), repeating-linear-gradient(90deg, #dc2626 0px, #dc2626 2px, transparent 2px, transparent 60px)',
      backgroundSize: '60px 40px'
    }}></div>
    
    <div className="relative bg-gradient-to-br from-indigo-900/20 via-slate-900/40 to-slate-950/20 border-2 border-indigo-500/30 rounded-[4rem] p-12 sm:p-20 backdrop-blur-xl shadow-2xl">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 rounded-[4rem] blur-2xl opacity-50"></div>
      
      <div className="relative space-y-12 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/30 blur-3xl rounded-full"></div>
            <div className="relative size-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/50 border-2 border-amber-300/50">
              <span className="material-symbols-outlined text-5xl text-white drop-shadow-lg">military_tech</span>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Supporting Our <span className="text-gradient-primary inline-block pb-1">Veterans</span>
          </h2>
          <p className="text-xl sm:text-2xl font-bold text-indigo-300 tracking-wide">
            A Commitment to Those Who Served
          </p>
        </div>

        {/* Body Text */}
        <div className="max-w-3xl mx-auto">
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-medium">
            We are committed to supporting <span className="text-white font-bold">veterans with PTSD</span> through 
            evidence-based psychedelic therapy research. A portion of our network's de-identified data contributes to 
            <span className="text-indigo-300 font-bold"> VA-partnered studies</span> on MDMA-assisted therapy and 
            psilocybin for treatment-resistant PTSD.
          </p>
        </div>

        {/* Testimonial */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-950/60 border-2 border-indigo-500/20 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-4xl text-indigo-400 opacity-50">format_quote</span>
              <div className="flex-1 space-y-4">
                <p className="text-lg italic text-slate-200 leading-relaxed">
                  "After 15 years of failed treatments, psychedelic-assisted therapy gave me my life back."
                </p>
                <p className="text-sm font-black text-indigo-400 uppercase tracking-widest">
                  — Marine Veteran, 2024
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-6">
          <button
            onClick={() => window.open('https://ppn.network/veterans', '_blank')}
            className="px-10 py-5 bg-primary hover:bg-blue-600 text-white text-sm font-black rounded-2xl uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
          >
            <span className="material-symbols-outlined">info</span>
            Learn More About Our Veterans Initiative
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-indigo-500/20">
          <div className="space-y-2">
            <p className="text-3xl font-black text-white">2,400+</p>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Veterans Enrolled</p>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-black text-clinical-green">78%</p>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">PTSD Symptom Reduction</p>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-black text-indigo-400">12</p>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">VA Partner Sites</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 🔵 **ENHANCEMENT 2: Button Consistency**

### **Issue:**
Solid blue buttons have inconsistent:
- Sizes (padding)
- Text formatting (font-size, weight, tracking)
- Border radius

### **Solution:**
Create a standardized button class and update all instances.

---

### **Standard Button Specification:**

```css
/* Add to src/index.css */

.btn-primary {
  /* Size */
  padding: 1.25rem 2rem; /* py-5 px-8 */
  
  /* Colors */
  background-color: #2b74f3; /* bg-primary */
  color: white;
  
  /* Typography */
  font-size: 0.8125rem; /* text-sm */
  font-weight: 900; /* font-black */
  text-transform: uppercase;
  letter-spacing: 0.2em; /* tracking-[0.2em] */
  
  /* Shape */
  border-radius: 1rem; /* rounded-2xl */
  
  /* Effects */
  box-shadow: 0 20px 25px -5px rgba(43, 116, 243, 0.2), 0 10px 10px -5px rgba(43, 116, 243, 0.1);
  transition: all 0.2s ease-in-out;
  
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background-color: #1d5dd9; /* hover:bg-blue-600 */
  transform: scale(1.02);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

### **Buttons to Update:**

**File:** `src/pages/Landing.tsx`

**Find and replace ALL instances:**

```tsx
// BEFORE (various inconsistent styles):
className="px-8 py-5 bg-primary hover:bg-blue-600..."
className="px-10 py-4 bg-primary..."
className="px-6 py-3 bg-primary..."

// AFTER (consistent):
className="btn-primary"
```

**Specific locations to update:**
1. Hero CTA buttons (line ~194-202)
2. Veterans Initiative button (new section)
3. About PPN CTA (if exists)
4. Any other blue primary buttons

---

## 📝 **ENHANCEMENT 3: Practitioner Registration Page**

### **New Page Required:**
`src/pages/Register.tsx`

---

### **Registration Page Design:**

**Visual Concept:**
```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  [PPN Logo]                                                   ║
║                                                               ║
║         Join the Psychedelic Practitioners Network           ║
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  Step 1: Practitioner Information                        │ ║
║  │  ┌──────────────────────────────────────────┐            │ ║
║  │  │ Full Name *                              │            │ ║
║  │  └──────────────────────────────────────────┘            │ ║
║  │  ┌──────────────────────────────────────────┐            │ ║
║  │  │ Professional Email *                     │            │ ║
║  │  └──────────────────────────────────────────┘            │ ║
║  │  ┌──────────────────────────────────────────┐            │ ║
║  │  │ License Type * [Dropdown]                │            │ ║
║  │  └──────────────────────────────────────────┘            │ ║
║  │  ┌──────────────────────────────────────────┐            │ ║
║  │  │ License Number *                         │            │ ║
║  │  └──────────────────────────────────────────┘            │ ║
║  │  ┌──────────────────────────────────────────┐            │ ║
║  │  │ State/Region * [Dropdown]                │            │ ║
║  │  └──────────────────────────────────────────┘            │ ║
║  │  ┌──────────────────────────────────────────┐            │ ║
║  │  │ Institution/Clinic Name *                │            │ ║
║  │  └──────────────────────────────────────────┘            │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │  Step 2: Account Security                                │ ║
║  │  ┌──────────────────────────────────────────┐            │ ║
║  │  │ Password *                               │            │ ║
║  │  └──────────────────────────────────────────┘            │ ║
║  │  ┌──────────────────────────────────────────┐            │ ║
║  │  │ Confirm Password *                       │            │ ║
║  │  └──────────────────────────────────────────┘            │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ☑ I agree to the Terms of Service and Privacy Policy        ║
║  ☑ I certify that I am a licensed healthcare practitioner    ║
║                                                               ║
║  [Submit Application] [CTA Button]                           ║
║                                                               ║
║  Already have an account? [Log In]                           ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

### **Implementation Code:**

**File:** `src/pages/Register.tsx` (NEW)

```tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const LICENSE_TYPES = [
  'MD - Medical Doctor',
  'DO - Doctor of Osteopathic Medicine',
  'PhD - Doctor of Philosophy (Psychology)',
  'PsyD - Doctor of Psychology',
  'LCSW - Licensed Clinical Social Worker',
  'LPC - Licensed Professional Counselor',
  'LMFT - Licensed Marriage and Family Therapist',
  'NP - Nurse Practitioner',
  'PA - Physician Assistant',
  'RN - Registered Nurse',
  'Other'
];

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    licenseType: '',
    licenseNumber: '',
    state: '',
    institution: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    certifyLicensed: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!formData.fullName || !formData.email || !formData.licenseType || 
        !formData.licenseNumber || !formData.state || !formData.institution ||
        !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms || !formData.certifyLicensed) {
      setError('Please agree to all certifications');
      setLoading(false);
      return;
    }

    try {
      // Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            license_type: formData.licenseType,
            license_number: formData.licenseNumber,
            state: formData.state,
            institution: formData.institution
          }
        }
      });

      if (authError) throw authError;

      setSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900/60 border-2 border-clinical-green/50 rounded-3xl p-12 text-center space-y-6">
          <div className="flex justify-center">
            <div className="size-20 bg-clinical-green/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-clinical-green" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white">Registration Successful!</h2>
          <p className="text-slate-300 leading-relaxed">
            Please check your email to verify your account. You'll be redirected to the login page shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Join the <span className="text-gradient-primary inline-block pb-1">Psychedelic Practitioners</span> Network
          </h1>
          <p className="text-slate-400 text-lg">
            Apply for institutional node access
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-500/10 border-2 border-red-500/50 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Practitioner Information */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6">
            <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
              <span className="size-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary text-sm font-black">1</span>
              Practitioner Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Professional Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">License Type *</label>
                <select
                  name="licenseType"
                  value={formData.licenseType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  required
                >
                  <option value="">Select license type...</option>
                  {LICENSE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">License Number *</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">State/Region *</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  required
                >
                  <option value="">Select state...</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Institution/Clinic Name *</label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Step 2: Account Security */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-6">
            <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
              <span className="size-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary text-sm font-black">2</span>
              Account Security
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  required
                  minLength={8}
                />
                <p className="text-xs text-slate-500 mt-1">Minimum 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 size-5 rounded border-slate-700 bg-slate-950 text-primary focus:ring-primary/50"
                required
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="certifyLicensed"
                checked={formData.certifyLicensed}
                onChange={handleChange}
                className="mt-1 size-5 rounded border-slate-700 bg-slate-950 text-primary focus:ring-primary/50"
                required
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                I certify that I am a licensed healthcare practitioner authorized to practice in my jurisdiction
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting Application...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">send</span>
                Submit Application
              </>
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-bold">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
```

---

### **Add Route:**

**File:** `src/App.tsx`

```tsx
// Add import:
import Register from './pages/Register';

// Add route:
<Route path="/register" element={<Register />} />
```

---

### **Add Link to Landing Page:**

**File:** `src/pages/Landing.tsx`

Find the "Access Portal" button and add a "Register" button next to it:

```tsx
<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
  <button
    onClick={() => navigate('/login')}
    className="btn-primary flex-1"
  >
    <span className="material-symbols-outlined">login</span>
    Access Portal
  </button>
  <button
    onClick={() => navigate('/register')}
    className="flex-1 px-8 py-5 bg-transparent border-2 border-primary text-primary hover:bg-primary/10 text-sm font-black rounded-2xl uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
  >
    <span className="material-symbols-outlined">person_add</span>
    Register
  </button>
</div>
```

---

## 🎯 **ENHANCEMENT 4: Guided Tour Auto-Play**

### **Current State:**
Guided tour exists but doesn't auto-play for first-time users.

### **Solution:**
Add localStorage check to trigger tour on first login.

---

### **Implementation:**

**File:** `src/components/GuidedTour.tsx` (or wherever tour is defined)

**Add auto-play logic:**

```typescript
import { useEffect } from 'react';

// Inside component:
useEffect(() => {
  // Check if user has seen tour
  const hasSeenTour = localStorage.getItem('ppn_tour_completed');
  const isFirstLogin = localStorage.getItem('ppn_first_login') === 'true';
  
  if (!hasSeenTour && isFirstLogin) {
    // Auto-start tour
    startTour();
    
    // Mark first login as complete
    localStorage.setItem('ppn_first_login', 'false');
  }
}, []);

// When tour completes:
const handleTourComplete = () => {
  localStorage.setItem('ppn_tour_completed', 'true');
  // ... rest of completion logic
};
```

**Set first login flag on successful login:**

**File:** `src/pages/Login.tsx` (or auth handler)

```typescript
// After successful login:
const isNewUser = !localStorage.getItem('ppn_tour_completed');
if (isNewUser) {
  localStorage.setItem('ppn_first_login', 'true');
}
navigate('/dashboard');
```

---

## 📋 **SUMMARY OF CHANGES**

### **Files to Modify:**
1. `src/pages/Landing.tsx` - Veterans section + button consistency
2. `src/index.css` - `.btn-primary` class
3. `src/pages/Register.tsx` - NEW registration page
4. `src/App.tsx` - Add /register route
5. `src/components/GuidedTour.tsx` - Auto-play logic
6. `src/pages/Login.tsx` - First login flag

### **Time Estimate:**
- Veterans section redesign: 20 min
- Button consistency: 15 min
- Registration page: 45 min
- Guided tour auto-play: 10 min
- **Total: 90 minutes**

---

## ✅ **TESTING CHECKLIST**

- [ ] Veterans section displays prominently above About PPN
- [ ] Veterans section looks premium (not afterthought)
- [ ] All blue buttons same size/style
- [ ] Registration page loads correctly
- [ ] Registration form validates properly
- [ ] Registration creates Supabase user
- [ ] Guided tour auto-plays on first login
- [ ] Tour doesn't replay on subsequent logins
- [ ] Mobile responsive on all new sections

---

**Add these enhancements to BATCH 3 or create BATCH 4 for post-launch polish!** 🎨✨
