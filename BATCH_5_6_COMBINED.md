# 🔧 BATCH 5+6: PROFILE, DATA & POLISH (COMBINED)
**Date:** February 9, 2026 22:08 PST  
**Purpose:** Create profile modal + Supabase integration + premium polish  
**Total Time:** 255 minutes (4.25 hours)  
**Priority:** Week 1 post-launch

---

## 🎯 **IMPLEMENTATION STRATEGY**

**Safe, Logical Sequence:**
1. **Data Layer First** - Supabase integration (no UI changes)
2. **UI Polish** - Enhance existing pages (low risk)
3. **New Features** - Profile creation modal (isolated)

**Why This Order:**
- ✅ Data layer changes are isolated (no visual impact)
- ✅ UI polish is cosmetic (low risk)
- ✅ New modal is self-contained (doesn't break existing)

---

## 📋 **TASK SEQUENCE**

### **PHASE 1: DATA LAYER (105 min)** 🔵

Connect pages to Supabase (backend only, no UI changes)

---

#### **TASK 1.1: Audit Logs Supabase Integration** (45 min)

**File:** `src/pages/AuditLogs.tsx`

**Current:** Uses `AUDIT_LOGS` constant (mock data)  
**Goal:** Query `system_events` table from Supabase

**Changes:**

```tsx
// BEFORE (lines 1-6):
import React, { useState, useMemo } from 'react';
import { AUDIT_LOGS } from '../constants';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';

// AFTER:
import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch audit logs from Supabase
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        // Query system_events table
        let query = supabase
          .from('system_events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        // Apply filters if set
        if (actionFilter !== 'All') {
          query = query.eq('action', actionFilter);
        }

        if (startDate) {
          query = query.gte('created_at', new Date(startDate).toISOString());
        }

        if (endDate) {
          query = query.lte('created_at', new Date(endDate).toISOString());
        }

        const { data, error } = await query;

        if (error) throw error;

        setLogs(data || []);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        // Fallback to empty array
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [actionFilter, startDate, endDate]);

  // Filter logs by search query
  const filteredLogs = useMemo(() => {
    if (!searchQuery) return logs;
    const query = searchQuery.toLowerCase();
    return logs.filter(log => 
      log.actor_id?.toLowerCase().includes(query) ||
      log.action?.toLowerCase().includes(query) ||
      log.entity_type?.toLowerCase().includes(query) ||
      log.entity_id?.toLowerCase().includes(query)
    );
  }, [logs, searchQuery]);

  // ... rest of component
};
```

**Add Search/Filter UI (before table):**

```tsx
{/* Search and Filters */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
  {/* Search */}
  <div className="relative">
    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
    <input
      type="text"
      placeholder="Search logs..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-primary transition-all"
    />
  </div>

  {/* Action Filter */}
  <select
    value={actionFilter}
    onChange={(e) => setActionFilter(e.target.value)}
    className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-primary"
  >
    <option value="All">All Actions</option>
    <option value="create">Create</option>
    <option value="update">Update</option>
    <option value="delete">Delete</option>
    <option value="login">Login</option>
    <option value="logout">Logout</option>
  </select>

  {/* Start Date */}
  <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-primary"
  />

  {/* End Date */}
  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-primary"
  />
</div>

{/* Loading State */}
{loading && (
  <div className="text-center py-12">
    <div className="inline-block size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="text-slate-500 text-sm font-medium mt-4">Loading audit logs...</p>
  </div>
)}
```

**Testing:**
- [ ] Logs load from Supabase
- [ ] Search filters correctly
- [ ] Action filter works
- [ ] Date range filter works
- [ ] Loading state displays
- [ ] No console errors

---

#### **TASK 1.2: Settings Supabase Integration** (60 min)

**File:** `src/pages/Settings.tsx`

**Current:** Uses localStorage  
**Goal:** Store in Supabase user metadata + user_sites table

**Changes:**

```tsx
// Add Supabase import
import { supabase } from '../supabaseClient';

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Profile
    displayName: '',
    email: '',
    institution: '',
    
    // Notifications
    emailNotifications: true,
    protocolAlerts: true,
    safetyAlerts: true,
    weeklyDigest: false,
    
    // Privacy
    profileVisibility: 'network',
    dataSharing: true,
    
    // Preferences
    theme: 'dark',
    timezone: 'America/Los_Angeles',
    language: 'en'
  });

  // Load settings from Supabase
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        // Get user metadata
        const userMetadata = user.user_metadata || {};
        
        // Get user_sites data
        const { data: userSite } = await supabase
          .from('user_sites')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setSettings({
          displayName: userMetadata.display_name || user.email?.split('@')[0] || '',
          email: user.email || '',
          institution: userSite?.site_id || '',
          emailNotifications: userMetadata.email_notifications ?? true,
          protocolAlerts: userMetadata.protocol_alerts ?? true,
          safetyAlerts: userMetadata.safety_alerts ?? true,
          weeklyDigest: userMetadata.weekly_digest ?? false,
          profileVisibility: userMetadata.profile_visibility || 'network',
          dataSharing: userMetadata.data_sharing ?? true,
          theme: userMetadata.theme || 'dark',
          timezone: userMetadata.timezone || 'America/Los_Angeles',
          language: userMetadata.language || 'en'
        });
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to Supabase
  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('You must be logged in to save settings');
        return;
      }

      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: settings.displayName,
          email_notifications: settings.emailNotifications,
          protocol_alerts: settings.protocolAlerts,
          safety_alerts: settings.safetyAlerts,
          weekly_digest: settings.weeklyDigest,
          profile_visibility: settings.profileVisibility,
          data_sharing: settings.dataSharing,
          theme: settings.theme,
          timezone: settings.timezone,
          language: settings.language
        }
      });

      if (error) throw error;

      // Show success toast
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Email change
  const handleEmailChange = async (newEmail: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      alert('Verification email sent to ' + newEmail);
    } catch (error) {
      console.error('Error changing email:', error);
      alert('Failed to change email. Please try again.');
    }
  };

  // Password change
  const handlePasswordChange = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    }
  };

  // ... rest of component
};
```

**Add Save Button:**

```tsx
{/* Save Button - Fixed at bottom */}
<div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900/95 border-t border-slate-800 backdrop-blur-xl z-50">
  <div className="max-w-4xl mx-auto flex justify-end gap-4">
    <button
      onClick={() => window.location.reload()}
      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-all"
    >
      Cancel
    </button>
    <button
      onClick={handleSave}
      disabled={saving}
      className="px-8 py-3 bg-primary hover:bg-blue-600 text-white text-sm font-black rounded-xl uppercase tracking-wider transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {saving ? (
        <>
          <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Saving...
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-lg">save</span>
          Save Settings
        </>
      )}
    </button>
  </div>
</div>
```

**Testing:**
- [ ] Settings load from Supabase
- [ ] Save button works
- [ ] Email change sends verification
- [ ] Password change works
- [ ] Loading state displays
- [ ] Success/error messages show
- [ ] No console errors

---

### **PHASE 2: UI POLISH (90 min)** 🎨

Enhance visual design (no functionality changes)

---

#### **TASK 2.1: My Protocols Table Polish** (30 min)

**File:** `src/pages/ProtocolBuilder.tsx`

**Goal:** Glassmorphic table rows, better status badges, substance icons

**Changes:**

```tsx
{/* Replace table rows (lines 361-386) with: */}
<tbody className="divide-y divide-slate-800/30">
  {filteredProtocols.map((p) => (
    <tr 
      key={p.id} 
      className="group relative hover:bg-primary/5 transition-all cursor-pointer"
      onClick={() => navigate(`/protocol/${p.id}`)}
    >
      {/* Hover glow effect */}
      <td colSpan={4} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </td>

      <td className="px-8 py-6 relative z-10">
        <div className="flex items-center gap-4">
          {/* Substance icon */}
          <div className="size-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-primary text-2xl">
              {p.protocol.substance === 'Psilocybin' ? 'psychiatry' : 
               p.protocol.substance === 'Ketamine' ? 'science' :
               p.protocol.substance === 'MDMA' ? 'favorite' : 'medication'}
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-base font-black text-white leading-tight group-hover:text-primary transition-colors">
              {p.protocol.substance} Protocol
            </span>
            <span className="text-[11px] font-mono text-slate-500 font-bold tracking-tight mt-1">
              {p.id} • {p.siteId}
            </span>
          </div>
        </div>
      </td>

      <td className="px-8 py-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <div className={`size-2 rounded-full ${
            p.status === 'Completed' ? 'bg-clinical-green animate-pulse' : 
            p.status === 'Active' ? 'bg-primary animate-pulse' : 
            'bg-slate-500'
          }`}></div>
          <span className={`text-xs font-black uppercase tracking-wider ${
            p.status === 'Completed' ? 'text-clinical-green' : 
            p.status === 'Active' ? 'text-primary' : 
            'text-slate-500'
          }`}>
            {p.status}
          </span>
        </div>
      </td>

      <td className="px-8 py-6 text-sm font-mono text-slate-400 relative z-10">
        <span className="font-bold text-white">{p.protocol.dosage}</span> {p.protocol.dosageUnit}
      </td>

      <td className="px-8 py-6 text-right relative z-10">
        <div className="flex items-center justify-end gap-2 text-[11px] font-black text-primary group-hover:text-white uppercase tracking-widest transition-colors">
          <span>Open Protocol</span>
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </div>
      </td>
    </tr>
  ))}
</tbody>
```

**Testing:**
- [ ] Table rows have glassmorphic hover effect
- [ ] Substance icons display correctly
- [ ] Status badges are larger and animated
- [ ] Hover animations smooth
- [ ] Click navigation works

---

#### **TASK 2.2: Audit Logs Design Polish** (30 min)

**File:** `src/pages/AuditLogs.tsx`

**Goal:** Glassmorphic cards, action icons, better colors

**Changes:**

```tsx
{/* Replace table with card grid */}
<div className="grid grid-cols-1 gap-4">
  {filteredLogs.map((log) => (
    <div 
      key={log.id}
      className="group relative bg-slate-900/40 border border-slate-800 hover:border-slate-600 rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-0.5"
    >
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
      
      <div className="relative flex items-start gap-4">
        {/* Action icon */}
        <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${
          log.action === 'create' ? 'bg-clinical-green/10 border border-clinical-green/30' :
          log.action === 'update' ? 'bg-primary/10 border border-primary/30' :
          log.action === 'delete' ? 'bg-red-500/10 border border-red-500/30' :
          log.action === 'login' ? 'bg-emerald-500/10 border border-emerald-500/30' :
          log.action === 'logout' ? 'bg-amber-500/10 border border-amber-500/30' :
          'bg-slate-800 border border-slate-700'
        }`}>
          <span className={`material-symbols-outlined text-2xl ${
            log.action === 'create' ? 'text-clinical-green' :
            log.action === 'update' ? 'text-primary' :
            log.action === 'delete' ? 'text-red-500' :
            log.action === 'login' ? 'text-emerald-500' :
            log.action === 'logout' ? 'text-amber-500' :
            'text-slate-500'
          }`}>
            {log.action === 'create' ? 'add_circle' :
             log.action === 'update' ? 'edit' :
             log.action === 'delete' ? 'delete' :
             log.action === 'login' ? 'login' :
             log.action === 'logout' ? 'logout' :
             'info'}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h4 className="text-base font-black text-white uppercase tracking-wider">
              {log.action}
            </h4>
            <span className="text-xs font-mono text-slate-500 whitespace-nowrap">
              {new Date(log.created_at).toLocaleString()}
            </span>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-slate-400">
              <span className="font-bold text-slate-300">Actor:</span> {log.actor_id}
            </p>
            <p className="text-sm text-slate-400">
              <span className="font-bold text-slate-300">Entity:</span> {log.entity_type} • {log.entity_id}
            </p>
            {log.metadata && (
              <p className="text-xs text-slate-500 font-mono mt-2">
                {JSON.stringify(log.metadata, null, 2)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
```

**Testing:**
- [ ] Cards display with glassmorphic design
- [ ] Action icons show correctly
- [ ] Colors match action types
- [ ] Hover effects smooth
- [ ] Timestamps formatted correctly

---

#### **TASK 2.3: Settings Design Polish** (30 min)

**File:** `src/pages/Settings.tsx`

**Goal:** Glassmorphic sections, better layout, loading states

**Changes:**

```tsx
{/* Wrap each settings section in glassmorphic card */}
<div className="space-y-8">
  {/* Profile Settings */}
  <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 shadow-xl">
    <div className="flex items-center gap-3 mb-6">
      <div className="size-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-2xl">person</span>
      </div>
      <div>
        <h2 className="text-xl font-black text-white uppercase tracking-wider">Profile Settings</h2>
        <p className="text-xs text-slate-500 font-medium">Manage your account information</p>
      </div>
    </div>
    
    <div className="space-y-4">
      {/* Form fields here */}
    </div>
  </div>

  {/* Notification Settings */}
  <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 shadow-xl">
    <div className="flex items-center gap-3 mb-6">
      <div className="size-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
        <span className="material-symbols-outlined text-amber-500 text-2xl">notifications</span>
      </div>
      <div>
        <h2 className="text-xl font-black text-white uppercase tracking-wider">Notifications</h2>
        <p className="text-xs text-slate-500 font-medium">Configure alert preferences</p>
      </div>
    </div>
    
    <div className="space-y-4">
      {/* Toggle switches here */}
    </div>
  </div>

  {/* Security Settings */}
  <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 shadow-xl">
    <div className="flex items-center gap-3 mb-6">
      <div className="size-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
        <span className="material-symbols-outlined text-red-500 text-2xl">security</span>
      </div>
      <div>
        <h2 className="text-xl font-black text-white uppercase tracking-wider">Security</h2>
        <p className="text-xs text-slate-500 font-medium">Password and authentication</p>
      </div>
    </div>
    
    <div className="space-y-4">
      {/* Security fields here */}
    </div>
  </div>
</div>
```

**Testing:**
- [ ] Sections have glassmorphic design
- [ ] Icons display correctly
- [ ] Layout is clean and organized
- [ ] Loading states work
- [ ] Save button is sticky at bottom

---

### **PHASE 3: NEW FEATURES (60 min)** ⭐

Create new profile modal (isolated, no impact on existing)

---

#### **TASK 3.1: Create Clinician Profile Modal** (60 min)

**File:** `src/components/CreateProfileModal.tsx` (NEW)

**Goal:** Multi-step profile creation for new practitioners

**Full Implementation:**

```tsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { X, Upload, User, Briefcase, FileText } from 'lucide-react';

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: '',
    credentials: '',
    specialties: [] as string[],
    photoFile: null as File | null,
    
    // Step 2: Professional
    licenseType: '',
    licenseNumber: '',
    state: '',
    institution: '',
    
    // Step 3: Bio
    bio: '',
    yearsExperience: '',
    researchInterests: ''
  });

  const SPECIALTY_OPTIONS = [
    'PTSD Treatment',
    'Depression',
    'Anxiety Disorders',
    'Addiction Medicine',
    'End-of-Life Care',
    'Trauma Therapy',
    'Psychedelic Integration',
    'Clinical Research'
  ];

  const LICENSE_TYPES = [
    'MD - Medical Doctor',
    'DO - Doctor of Osteopathic Medicine',
    'PhD - Doctor of Philosophy (Psychology)',
    'PsyD - Doctor of Psychology',
    'LCSW - Licensed Clinical Social Worker',
    'LPC - Licensed Professional Counselor',
    'LMFT - Licensed Marriage and Family Therapist',
    'NP - Nurse Practitioner',
    'PA - Physician Assistant'
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photoFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload photo if provided
      let photoUrl = null;
      if (formData.photoFile) {
        const fileExt = formData.photoFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-photos')
          .upload(fileName, formData.photoFile);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(fileName);
        
        photoUrl = publicUrl;
      }

      // Update user metadata
      await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          credentials: formData.credentials,
          specialties: formData.specialties,
          photo_url: photoUrl,
          license_type: formData.licenseType,
          license_number: formData.licenseNumber,
          state: formData.state,
          institution: formData.institution,
          bio: formData.bio,
          years_experience: formData.yearsExperience,
          research_interests: formData.researchInterests,
          profile_completed: true
        }
      });

      onComplete();
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Create Your Profile</h2>
            <p className="text-sm text-slate-400 mt-1">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-slate-950">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          
          {/* Step 1: Personal */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Personal Information</h3>
                  <p className="text-xs text-slate-500">Tell us about yourself</p>
                </div>
              </div>

              {/* Photo upload */}
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Profile Photo (Optional)</label>
                <div className="flex items-center gap-4">
                  <div className="size-24 rounded-2xl bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="size-full object-cover" />
                    ) : (
                      <Upload className="w-8 h-8 text-slate-600" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl cursor-pointer transition-all"
                  >
                    Choose Photo
                  </label>
                </div>
              </div>

              {/* Full name */}
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Dr. Jane Smith"
                />
              </div>

              {/* Credentials */}
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Credentials *</label>
                <input
                  type="text"
                  value={formData.credentials}
                  onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary transition-all"
                  placeholder="MD, PhD"
                />
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Specialties (Select up to 3)</label>
                <div className="grid grid-cols-2 gap-2">
                  {SPECIALTY_OPTIONS.map(spec => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => toggleSpecialty(spec)}
                      disabled={!formData.specialties.includes(spec) && formData.specialties.length >= 3}
                      className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                        formData.specialties.includes(spec)
                          ? 'bg-primary text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Professional Details</h3>
                  <p className="text-xs text-slate-500">License and institution</p>
                </div>
              </div>

              {/* License type */}
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">License Type *</label>
                <select
                  value={formData.licenseType}
                  onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="">Select license type...</option>
                  {LICENSE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* License number */}
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">License Number *</label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">State/Region *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary transition-all"
                  placeholder="California"
                />
              </div>

              {/* Institution */}
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Institution/Clinic *</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Johns Hopkins Medicine"
                />
              </div>
            </div>
          )}

          {/* Step 3: Bio */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">About You</h3>
                  <p className="text-xs text-slate-500">Share your background</p>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">
                  Professional Bio (200 characters max)
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value.slice(0, 200) })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary transition-all resize-none h-32"
                  placeholder="Brief description of your practice and approach..."
                />
                <p className="text-xs text-slate-500 mt-1 text-right">
                  {formData.bio.length}/200
                </p>
              </div>

              {/* Years experience */}
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Years of Experience</label>
                <input
                  type="number"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary transition-all"
                  placeholder="10"
                />
              </div>

              {/* Research interests */}
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Research Interests (Optional)</label>
                <input
                  type="text"
                  value={formData.researchInterests}
                  onChange={(e) => setFormData({ ...formData, researchInterests: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-primary transition-all"
                  placeholder="PTSD, psychedelic integration, neuroplasticity"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-between">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-all"
            >
              Back
            </button>
          )}
          
          <div className="ml-auto flex gap-3">
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && (!formData.fullName || !formData.credentials)) ||
                  (step === 2 && (!formData.licenseType || !formData.licenseNumber || !formData.state || !formData.institution))
                }
                className="px-8 py-3 bg-primary hover:bg-blue-600 text-white text-sm font-black rounded-xl uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-clinical-green hover:bg-emerald-600 text-white text-sm font-black rounded-xl uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  'Complete Profile'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfileModal;
```

**Add to ClinicianProfile.tsx:**

```tsx
import CreateProfileModal from '../components/CreateProfileModal';

// Add state
const [showCreateModal, setShowCreateModal] = useState(false);

// Add button to trigger modal
<button
  onClick={() => setShowCreateModal(true)}
  className="px-6 py-3 bg-primary hover:bg-blue-600 text-white text-sm font-black rounded-xl uppercase tracking-wider transition-all"
>
  Create Profile
</button>

// Add modal
<CreateProfileModal
  isOpen={showCreateModal}
  onClose={() => setShowCreateModal(false)}
  onComplete={() => {
    setShowCreateModal(false);
    window.location.reload();
  }}
/>
```

**Testing:**
- [ ] Modal opens correctly
- [ ] Step 1 (personal) works
- [ ] Step 2 (professional) works
- [ ] Step 3 (bio) works
- [ ] Photo upload works
- [ ] Specialty selection works (max 3)
- [ ] Validation works
- [ ] Progress bar updates
- [ ] Submit saves to Supabase
- [ ] Modal closes on complete

---

## ✅ **FINAL TESTING CHECKLIST**

### **Phase 1: Data Layer**
- [ ] Audit logs load from Supabase
- [ ] Audit logs search/filter works
- [ ] Settings load from Supabase
- [ ] Settings save to Supabase
- [ ] Email/password change works

### **Phase 2: UI Polish**
- [ ] My Protocols table has glassmorphic design
- [ ] Audit Logs cards look premium
- [ ] Settings sections look premium
- [ ] All hover effects smooth
- [ ] No console errors

### **Phase 3: New Features**
- [ ] Profile modal opens
- [ ] All 3 steps work
- [ ] Photo upload works
- [ ] Validation works
- [ ] Submit saves correctly

---

## 📊 **TIMELINE**

```
Phase 1 (Data):      105 min
Phase 2 (Polish):     90 min
Phase 3 (Features):   60 min
─────────────────────────────
TOTAL:               255 min (4.25 hours)
```

---

## 🚀 **DEPLOYMENT SEQUENCE**

1. **Commit after Phase 1** - "feat: connect audit logs and settings to Supabase"
2. **Commit after Phase 2** - "style: add glassmorphic polish to protocols, audit logs, settings"
3. **Commit after Phase 3** - "feat: add clinician profile creation modal"

**Safe rollback points at each phase!** ✅

---

**Ready for Builder to execute in sequence!** 🎉
