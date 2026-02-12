# Hostinger Go-Live Checklist for PPN Research Portal

**Last Updated**: 2026-02-10  
**Estimated Time**: 2-3 hours (first deployment)

---

## 📋 Pre-Deployment Checklist

Before you start, make sure you have:

- [ ] Hostinger hosting account with active plan
- [ ] Domain name configured (or using Hostinger subdomain)
- [ ] Supabase project fully set up and tested
- [ ] All environment variables documented
- [ ] FTP/SFTP credentials from Hostinger
- [ ] Local development working correctly

---

## 🔧 Step 1: Fix Local Build Permissions (CRITICAL)

You encountered permission issues earlier. Let's fix them first.

### 1.1 Fix npm Cache Permissions

Open **Terminal** (not through AI) and run:

```bash
sudo chown -R $(whoami) "/Users/trevorcalton/.npm"
```

Enter your Mac password when prompted.

### 1.2 Fix node_modules Permissions

```bash
cd /Users/trevorcalton/Documents/GitHub/PPN-Antigravity-1.0
sudo chown -R $(whoami) node_modules
```

### 1.3 Verify Permissions

```bash
ls -la | grep node_modules
```

You should see your username, not "root".

---

## 🏗️ Step 2: Create Production Environment File

### 2.1 Create `.env.production`

In your project root, create a new file called `.env.production`:

```bash
cd /Users/trevorcalton/Documents/GitHub/PPN-Antigravity-1.0
touch .env.production
```

### 2.2 Add Production Environment Variables

Edit `.env.production` with your **production** Supabase credentials:

```env
# Production Environment Variables
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**⚠️ IMPORTANT**: 
- Use your **production** Supabase project (not dev/test)
- Never commit this file to Git (it's already in `.gitignore`)
- Keep a backup copy somewhere safe

---

## 🔨 Step 3: Build the Production Bundle

### 3.1 Clean Previous Builds

```bash
rm -rf dist
```

### 3.2 Run Production Build

```bash
npm run build
```

**Expected Output**:
```
✓ built in 15-30s
✓ dist/index.html
✓ dist/assets/...
```

### 3.3 Verify Build Success

```bash
ls -la dist/
```

You should see:
- `index.html`
- `assets/` folder with CSS/JS files
- Any other static files

### 3.4 Test Build Locally (Optional but Recommended)

```bash
npm run preview
```

Visit `http://localhost:4173` and verify everything works.

---

## 🌐 Step 4: Configure Supabase for Production Domain

### 4.1 Get Your Production URL

Determine your production URL:
- **Custom domain**: `https://yourdomain.com`
- **Hostinger subdomain**: `https://yoursite.hostinger-site.com`

### 4.2 Update Supabase Settings

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your **production** project
3. Navigate to **Authentication** → **URL Configuration**
4. Add your production URL to:
   - **Site URL**: `https://yourdomain.com`
   - **Redirect URLs**: Add:
     - `https://yourdomain.com`
     - `https://yourdomain.com/login`
     - `https://yourdomain.com/signup`
     - `https://yourdomain.com/*` (wildcard for all routes)

5. Click **Save**

---

## 📤 Step 5: Upload to Hostinger

### Option A: Using Hostinger File Manager (Easiest)

#### 5.1 Access File Manager

1. Log in to [Hostinger Control Panel](https://hpanel.hostinger.com)
2. Go to **Files** → **File Manager**
3. Navigate to `public_html/` (or your domain's root folder)

#### 5.2 Clear Existing Files (If Any)

- Delete any existing files in `public_html/`
- Keep `.htaccess` if it exists (we'll update it)

#### 5.3 Upload Build Files

1. In File Manager, click **Upload Files**
2. Navigate to your local `dist/` folder:
   ```
   /Users/trevorcalton/Documents/GitHub/PPN-Antigravity-1.0/dist/
   ```
3. Select **ALL files and folders** inside `dist/`:
   - `index.html`
   - `assets/` folder
   - Any other files

4. Upload them to `public_html/`

**⚠️ CRITICAL**: Upload the **contents** of `dist/`, not the `dist/` folder itself!

---

### Option B: Using FTP/SFTP (Advanced)

#### 5.1 Get FTP Credentials

From Hostinger control panel:
1. Go to **Files** → **FTP Accounts**
2. Note your:
   - **Hostname**: `ftp.yourdomain.com`
   - **Username**: Usually your email or custom username
   - **Password**: Set or retrieve password
   - **Port**: 21 (FTP) or 22 (SFTP)

#### 5.2 Connect via FTP Client

Using **FileZilla** or **Cyberduck**:

1. Open your FTP client
2. Create new connection:
   - **Host**: Your FTP hostname
   - **Username**: Your FTP username
   - **Password**: Your FTP password
   - **Port**: 21 (or 22 for SFTP)

3. Connect

#### 5.3 Upload Files

1. Navigate to `public_html/` on the server (right panel)
2. Navigate to your local `dist/` folder (left panel)
3. Select all files **inside** `dist/`
4. Drag and drop to `public_html/`

---

## ⚙️ Step 6: Configure Server for React Router

React Router requires special server configuration to handle client-side routing.

### 6.1 Create `.htaccess` File

In `public_html/`, create a file named `.htaccess` with this content:

```apache
# Enable Rewrite Engine
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories that exist
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  
  # Rewrite everything else to index.html to allow React Router to work
  RewriteRule ^ index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  # Prevent MIME type sniffing
  Header set X-Content-Type-Options "nosniff"
  
  # Prevent clickjacking
  Header set X-Frame-Options "SAMEORIGIN"
  
  # Enable XSS protection
  Header set X-XSS-Protection "1; mode=block"
  
  # HTTPS redirect (uncomment if you have SSL)
  # Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>

# Compression for faster loading
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/json
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Images
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  
  # CSS and JavaScript
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  
  # HTML (no caching for SPA)
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Prevent directory browsing
Options -Indexes

# Protect sensitive files
<FilesMatch "^\.env">
  Order allow,deny
  Deny from all
</FilesMatch>
```

### 6.2 Upload `.htaccess`

- If using File Manager: Create new file, paste content, save as `.htaccess`
- If using FTP: Create locally, upload to `public_html/`

---

## 🔒 Step 7: Enable SSL/HTTPS (CRITICAL for Security)

### 7.1 Install SSL Certificate

1. In Hostinger control panel, go to **SSL**
2. Select your domain
3. Click **Install SSL** (Hostinger provides free SSL)
4. Wait 5-15 minutes for activation

### 7.2 Force HTTPS Redirect

Once SSL is active, add this to the **top** of your `.htaccess`:

```apache
# Force HTTPS
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

---

## ✅ Step 8: Test Your Deployment

### 8.1 Initial Load Test

Visit your domain: `https://yourdomain.com`

**Expected**: Landing page loads correctly

### 8.2 Navigation Test

Test all routes:
- [ ] `/` - Landing page
- [ ] `/login` - Login page loads
- [ ] `/signup` - Signup page loads
- [ ] `/dashboard` - Dashboard (after login)
- [ ] `/advanced-search` - Search portal
- [ ] `/builder` - Protocol Builder

**Refresh each page** to test React Router is working.

### 8.3 Authentication Test

1. Try to sign up or log in
2. Verify Supabase connection works
3. Check browser console for errors (F12 → Console)

### 8.4 Functionality Test

- [ ] Login/logout works
- [ ] Navigation works (all links)
- [ ] Data loads from Supabase
- [ ] Images load correctly
- [ ] No console errors
- [ ] Mobile responsive (test on phone)

### 8.5 Performance Test

Use [PageSpeed Insights](https://pagespeed.web.dev/):
- Enter your domain
- Check performance score
- Address any critical issues

---

## 🐛 Troubleshooting Common Issues

### Issue 1: Blank Page

**Symptoms**: White/blank page, no content

**Solutions**:
1. Check browser console (F12) for errors
2. Verify all files uploaded correctly
3. Check `.htaccess` is present
4. Verify `index.html` is in root of `public_html/`

### Issue 2: 404 on Page Refresh

**Symptoms**: Routes work initially, but 404 error when refreshing

**Solution**: `.htaccess` not configured correctly
- Verify `.htaccess` exists in `public_html/`
- Check Apache `mod_rewrite` is enabled (contact Hostinger support)

### Issue 3: Login Doesn't Work

**Symptoms**: Can't log in, authentication fails

**Solutions**:
1. Check Supabase redirect URLs include your domain
2. Verify environment variables were included in build
3. Check browser console for CORS errors
4. Verify Supabase project is production (not dev)

### Issue 4: Assets Not Loading (CSS/JS)

**Symptoms**: Page loads but no styling, broken layout

**Solutions**:
1. Verify `assets/` folder uploaded correctly
2. Check file permissions (644 for files, 755 for folders)
3. Clear browser cache (Ctrl+Shift+R)
4. Check browser console for 404 errors

### Issue 5: Environment Variables Not Working

**Symptoms**: Features that need API keys don't work

**Solutions**:
1. Verify you built with `.env.production`
2. Rebuild: `npm run build`
3. Re-upload `dist/` contents
4. Check variable names start with `VITE_`

---

## 🔐 Step 9: Security Hardening

### 9.1 Verify No Sensitive Files Uploaded

Make sure these are **NOT** on the server:
- ❌ `.env` files
- ❌ `node_modules/`
- ❌ `src/` folder
- ❌ `.git/` folder
- ❌ Any `.md` documentation files

**Only the `dist/` contents should be uploaded!**

### 9.2 Set Correct File Permissions

In File Manager or via FTP:
- Files: `644` (read/write for owner, read for others)
- Folders: `755` (read/write/execute for owner, read/execute for others)

### 9.3 Enable Supabase RLS Policies

1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Policies**
3. Verify Row-Level Security (RLS) is **enabled** on all tables
4. Test that users can only access their site's data

---

## 📊 Step 10: Post-Deployment Monitoring

### 10.1 Set Up Error Monitoring

Consider adding error tracking:
- **Sentry**: [sentry.io](https://sentry.io) (free tier available)
- **LogRocket**: [logrocket.com](https://logrocket.com)

### 10.2 Monitor Supabase Usage

1. Check Supabase Dashboard → **Usage**
2. Monitor:
   - Database size
   - API requests
   - Bandwidth
   - Active users

### 10.3 Set Up Uptime Monitoring

Use a service like:
- **UptimeRobot**: [uptimerobot.com](https://uptimerobot.com) (free)
- **Pingdom**: [pingdom.com](https://pingdom.com)

---

## 🚀 Step 11: Enable Authentication (CRITICAL!)

**⚠️ BEFORE going live with real users:**

### 11.1 Uncomment Auth Check

Edit `src/App.tsx` and uncomment lines 86-90:

```typescript
// CURRENTLY DISABLED - ENABLE BEFORE PRODUCTION!
useEffect(() => {
  if (!isAuthenticated) {
    navigate('/login');
  }
}, [isAuthenticated, navigate]);
```

### 11.2 Rebuild and Redeploy

```bash
npm run build
# Upload new dist/ contents to Hostinger
```

### 11.3 Test Auth Flow

- Verify unauthenticated users are redirected to login
- Test signup flow
- Test login flow
- Test logout

---

## ✅ Final Go-Live Checklist

Before announcing to users:

- [ ] SSL certificate active (HTTPS working)
- [ ] All pages load correctly
- [ ] Authentication enabled and working
- [ ] Supabase RLS policies active
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance acceptable (PageSpeed > 70)
- [ ] Error monitoring set up
- [ ] Uptime monitoring set up
- [ ] Backup plan documented
- [ ] Support email configured
- [ ] Privacy policy page added (if needed)
- [ ] Terms of service page added (if needed)

---

## 🔄 Future Updates

When you need to update the site:

1. Make changes locally
2. Test thoroughly (`npm run dev`)
3. Build: `npm run build`
4. Upload new `dist/` contents to Hostinger
5. Clear browser cache and test

**Pro Tip**: Consider setting up automatic deployments with GitHub Actions or Vercel for easier updates.

---

## 📞 Support Resources

### Hostinger Support
- **Live Chat**: Available 24/7 in control panel
- **Knowledge Base**: [support.hostinger.com](https://support.hostinger.com)
- **Email**: support@hostinger.com

### Supabase Support
- **Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Discord**: [discord.supabase.com](https://discord.supabase.com)
- **GitHub**: [github.com/supabase/supabase](https://github.com/supabase/supabase)

### Emergency Rollback

If something goes wrong:
1. Keep a backup of your previous `dist/` folder
2. Re-upload the old version
3. Debug locally before trying again

---

## 🎯 Quick Reference Commands

```bash
# Fix permissions
sudo chown -R $(whoami) "/Users/trevorcalton/.npm"
sudo chown -R $(whoami) node_modules

# Build for production
cd /Users/trevorcalton/Documents/GitHub/PPN-Antigravity-1.0
npm run build

# Test build locally
npm run preview

# Check build output
ls -la dist/
```

---

**Good luck with your deployment! 🚀**

If you encounter any issues not covered here, check the browser console first, then contact Hostinger support.
