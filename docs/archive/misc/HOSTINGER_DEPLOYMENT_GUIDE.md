# Hostinger Deployment Guide for PPN Research Portal

## Overview
This guide walks you through deploying your PPN Research Portal to Hostinger hosting.

## Prerequisites
- ✅ Hostinger hosting account with Node.js support
- ✅ Supabase project set up and configured
- ✅ Local development environment working
- ✅ Git repository up to date (already done!)

---

## Deployment Steps

### Step 1: Build the Production Bundle

**On your local machine**, run the build command:

```bash
cd /Users/trevorcalton/Documents/GitHub/PPN-Antigravity-1.0
npm run build
```

This will create a `dist/` folder containing:
- Optimized HTML, CSS, and JavaScript files
- All assets (images, fonts, etc.)
- Production-ready code with minification

**Expected output**: A `dist/` folder with your compiled application.

---

### Step 2: Configure Environment Variables

**IMPORTANT**: You need to set up environment variables for production.

#### Option A: Build with Environment Variables (Recommended)

1. Create a `.env.production` file in your project root:

```bash
# .env.production
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
VITE_GEMINI_API_KEY=your_actual_gemini_api_key
```

2. Build with production environment:

```bash
npm run build
```

Vite will automatically use `.env.production` during build.

#### Option B: Use Existing .env File

If you already have a `.env` file with production values, the build will use those.

---

### Step 3: Upload to Hostinger

You have **two main options** for uploading:

#### **Option A: FTP/SFTP Upload (Easiest)**

1. **Connect to Hostinger via FTP/SFTP**:
   - Use FileZilla, Cyberduck, or Hostinger's File Manager
   - Get credentials from Hostinger control panel

2. **Upload the `dist/` folder contents**:
   - Navigate to your public web directory (usually `public_html/`)
   - Upload **all files from inside the `dist/` folder** (not the folder itself)
   - This includes: `index.html`, `assets/`, and all other files

3. **Set up `.htaccess` for React Router** (see Step 4)

#### **Option B: Git Deployment (Advanced)**

If Hostinger supports Git deployment:

1. Connect your GitHub repository to Hostinger
2. Set up automatic deployments
3. Configure build commands in Hostinger panel:
   - Build command: `npm run build`
   - Publish directory: `dist`

---

### Step 4: Configure Server for Single Page Application (SPA)

React Router requires all routes to serve `index.html`. Create a `.htaccess` file:

**Create this file in your `public_html/` directory** (or wherever you uploaded the files):

```apache
# .htaccess for React Router
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
```

---

### Step 5: Verify Supabase Configuration

1. **Check Supabase URL Settings**:
   - Go to Supabase Dashboard → Settings → API
   - Add your Hostinger domain to "Site URL" and "Redirect URLs"
   - Example: `https://yourdomain.com`

2. **Update Authentication Settings**:
   - Add your production URL to allowed redirect URLs
   - This is critical for login/signup to work

---

### Step 6: Test Your Deployment

1. **Visit your Hostinger domain**
2. **Test critical functionality**:
   - ✅ Landing page loads
   - ✅ Login/signup works
   - ✅ Navigation works (all routes)
   - ✅ Supabase connection works
   - ✅ Protocol Builder loads
   - ✅ Analytics pages load

3. **Check browser console** for any errors

---

## What Files to Upload?

### ✅ Upload (from `dist/` folder):
- `index.html`
- `assets/` folder (contains all CSS, JS, images)
- Any other files generated in `dist/`

### ❌ Do NOT Upload:
- `node_modules/` (too large, not needed)
- `src/` (source code, not needed)
- `.env` files (security risk!)
- `.git/` folder
- Development files (`.md` docs, etc.)

**Only upload the contents of the `dist/` folder after building.**

---

## Troubleshooting

### Issue: Blank page or "Cannot GET /" error
**Solution**: Make sure `.htaccess` is configured correctly (Step 4)

### Issue: 404 errors on page refresh
**Solution**: Your server needs to redirect all routes to `index.html` (see `.htaccess`)

### Issue: Login doesn't work
**Solution**: 
- Check Supabase redirect URLs include your production domain
- Verify environment variables were included in build

### Issue: Environment variables not working
**Solution**: 
- Rebuild with `.env.production` file
- Make sure variables start with `VITE_` prefix
- Check browser console for actual values being used

### Issue: Assets not loading (CSS/JS)
**Solution**: 
- Check that `assets/` folder was uploaded
- Verify file permissions (644 for files, 755 for directories)

---

## Quick Deployment Checklist

- [ ] Run `npm run build` locally
- [ ] Verify `dist/` folder was created
- [ ] Upload contents of `dist/` to `public_html/`
- [ ] Create `.htaccess` file for React Router
- [ ] Add production domain to Supabase settings
- [ ] Test login/signup functionality
- [ ] Test all major pages and features
- [ ] Check browser console for errors

---

## Alternative: Using Vercel or Netlify (Recommended)

**Easier alternative to Hostinger**: Deploy to Vercel or Netlify for free with automatic builds:

### Vercel Deployment (Recommended):
```bash
npm install -g vercel
vercel login
vercel
```

### Netlify Deployment:
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

Both platforms:
- ✅ Automatic builds from GitHub
- ✅ Free SSL certificates
- ✅ CDN included
- ✅ Environment variable management
- ✅ Automatic deployments on git push

---

## Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check Hostinger error logs
3. Verify Supabase connection in Network tab
4. Test locally with `npm run preview` after building

---

**Last Updated**: 2026-02-10
**Version**: 1.0.0
