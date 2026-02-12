# 🔐 **DEMO LOGIN CREDENTIALS**

**Date:** 2026-02-10 14:32 PM  
**For:** Live Demo in 1 hour

---

## 🚨 **CRITICAL: YOU NEED SUPABASE CREDENTIALS**

The login page uses **real Supabase authentication** - there's no demo bypass mode.

---

## ✅ **OPTION 1: USE YOUR SUPABASE ACCOUNT (RECOMMENDED)**

### **If you have a Supabase account set up:**

**Email:** [Your Supabase user email]  
**Password:** [Your Supabase user password]

**To verify your credentials:**
1. Go to https://supabase.com/dashboard
2. Check your project
3. Go to Authentication → Users
4. See what test users exist

---

## ⚠️ **OPTION 2: CREATE A TEST USER NOW (15 MIN)**

### **Step 1: Go to Supabase Dashboard**
1. Open https://supabase.com/dashboard
2. Select your PPN project
3. Go to **Authentication** → **Users**

### **Step 2: Create Test User**
Click **Add User** (or **Invite User**)

**Recommended Demo User:**
- **Email:** `demo@ppn-research.org`
- **Password:** `Demo2024!Secure`
- **Auto-confirm:** Yes (check the box)

### **Step 3: Verify User Created**
- User should appear in the Users list
- Status should be "Confirmed"

### **Step 4: Test Login**
1. Start dev server: `npm run dev`
2. Go to http://localhost:5173/login
3. Enter demo credentials
4. Should redirect to /dashboard

---

## 🚫 **OPTION 3: BYPASS LOGIN (DEMO ONLY)**

### **Quick Hack: Skip Login for Demo**

If you don't have time to set up Supabase auth, you can temporarily bypass login:

**Edit:** `src/pages/Login.tsx`

**Replace the `handleLogin` function (lines 18-39) with:**

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  // DEMO MODE: Skip authentication
  navigate('/dashboard');
};
```

**⚠️ WARNING:**
- This bypasses all security
- Only for demo purposes
- Remove immediately after demo
- Some features may not work without real auth

---

## 🎯 **RECOMMENDED APPROACH FOR YOUR DEMO**

### **Best Option: Create Test User Now**

**Why:**
- Takes 5 minutes
- Shows real authentication
- All features work properly
- More professional

**Steps:**
1. Go to Supabase Dashboard
2. Authentication → Users → Add User
3. Email: `demo@ppn-research.org`
4. Password: `Demo2024!Secure`
5. Auto-confirm: ✅ Yes
6. Save

**Then in demo:**
- Show login page
- Enter demo credentials
- Successfully authenticate
- Redirect to dashboard

---

## 📋 **WHAT TO SAY DURING DEMO**

### **When showing login:**

"This is the secure authentication portal. We use Supabase for enterprise-grade authentication with row-level security. Let me log in with a test account..."

**[Enter credentials]**

"Authentication is role-based - network admins, site admins, clinicians, analysts, and auditors all have different access levels based on their role and site assignment."

---

## 🚨 **IF LOGIN FAILS DURING DEMO**

### **Error: "Invalid login credentials"**
**Say:** "Looks like I need to reset this test account. Let me show you the rest of the platform..."

**Then:** Navigate directly to `/dashboard` in the URL bar

### **Error: "Failed to connect to Supabase"**
**Say:** "We're in demo mode with the database disconnected for security. Let me show you the interface..."

**Then:** Use the bypass hack above

---

## ✅ **CURRENT STATUS**

**Login Method:** Real Supabase Authentication  
**Demo Bypass:** Not enabled (need to add)  
**Test User:** Unknown (check Supabase Dashboard)

---

## 🎯 **IMMEDIATE ACTION (CHOOSE ONE)**

### **Option A: Professional (5 min)**
1. Go to Supabase Dashboard
2. Create test user: `demo@ppn-research.org` / `Demo2024!Secure`
3. Test login works
4. Use in demo

### **Option B: Quick Hack (2 min)**
1. Edit `src/pages/Login.tsx`
2. Add bypass code (see above)
3. Any email/password will work
4. **REMOVE AFTER DEMO**

---

**Recommendation:** **Option A** - More professional, shows real auth

**Time Remaining:** 58 minutes  
**Decision Needed:** NOW

---

**Which option do you want to use?**
