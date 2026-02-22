# Domain Redirect Guide: `.com` and `.org` to `.net`

**Registrar:** Spaceship / Namecheap

To ensure all your traffic points to your primary `ppnportal.net` domain, you'll need to set up a 301 Permanent Redirect for your `.com` and `.org` domains at the registrar level.

## How to Redirect Using Spaceship

**Step 1: Log in to Spaceship**
Log into your Spaceship account and open the **Launchpad** (your dashboard).

**Step 2: Access Domain Portfolio**
Click on **Domains** or your Domain Portfolio to see a list of all the domains you currently own.

**Step 3: Select the `.com` Domain**
Find your `.com` domain in the list and click on it to open the domain management settings.

**Step 4: Go to Advanced DNS or URL Forwarding**
Look for the **Advanced DNS** tab or, if Spaceship provides a direct **URL Forwarding/Redirects** tool, select that. (Namecheap properties typically call this "Domain Redirect" or "URL Forwarding" under the Advanced DNS tab).

**Step 5: Add a Redirect Record**
Create a new redirect record with the following settings:
- **Host / Subdomain:** `@` (This represents the root domain, e.g., `ppnportal.com`)
- **Type:** `URL Redirect Record` (or `URL Forwarding`)
- **Value / Destination URL:** `https://ppnportal.net`
- **Redirect Type:** `Permanent (301)` (This is crucial for SEO, it tells search engines your site has permanently moved to the `.net`).

*Also add a rule for the `www` subdomain:*
- **Host / Subdomain:** `www`
- **Type:** `URL Redirect Record`
- **Value / Destination URL:** `https://ppnportal.net`
- **Redirect Type:** `Permanent (301)`

**Step 6: Save and Repeat for `.org`**
Click **Save**. Then, navigate back to your Domain Portfolio, click on your `.org` domain, and repeat Steps 4 and 5 exactly as above.

---

### Verifying the Redirect
DNS changes and redirects can take anywhere from a few minutes to 24 hours to fully propagate worldwide. 
1. Open an incognito browser window.
2. Type in your `.com` domain and hit Enter.
3. The URL in the address bar should instantly change to `https://ppnportal.net`.
4. Repeat the test for the `.org` domain.

If you run into any layout differences in Spaceship, look for any options labeled "Forwarding" or "Redirects" — the concept remains identical across all registrars.
