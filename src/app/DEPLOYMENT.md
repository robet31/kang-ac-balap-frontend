# 🚀 SUNEST AUTO - Deployment Guide

Complete guide untuk deploy Sunest Auto ke production.

---

## 📋 Table of Contents

1. [Pre-deployment Checklist](#pre-deployment-checklist)
2. [Deploy to Vercel](#deploy-to-vercel)
3. [Deploy Supabase Functions](#deploy-supabase-functions)
4. [Configure Production Environment](#configure-production-environment)
5. [Post-deployment Tasks](#post-deployment-tasks)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## ✅ Pre-deployment Checklist

Sebelum deploy, pastikan:

- [ ] All features tested locally
- [ ] No console errors
- [ ] Environment variables documented
- [ ] Database schema finalized
- [ ] Sample data seeded
- [ ] Build succeeds: `npm run build`
- [ ] Type check passes: `npm run type-check`
- [ ] Lint passes: `npm run lint`
- [ ] `.env.local` NOT committed (in .gitignore)
- [ ] Production URLs ready

---

## 🌐 Deploy to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

#### Step 1: Push to GitHub

```bash
# Commit all changes
git add .
git commit -m "Ready for production deployment"

# Push to GitHub
git push origin main
```

#### Step 2: Import to Vercel

1. Go to https://vercel.com/
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select **"sunest-auto"** repository

#### Step 3: Configure Build Settings

Vercel will auto-detect Next.js. Verify:

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

#### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tvugghippwvoxsjqyxkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Project
NEXT_PUBLIC_PROJECT_ID=tvugghippwvoxsjqyxkr
NEXT_PUBLIC_PROJECT_NAME=sunest-auto-new

# App URLs (Update after deployment!)
NEXT_PUBLIC_APP_URL=https://sunest-auto.vercel.app
NEXT_PUBLIC_API_URL=https://tvugghippwvoxsjqyxkr.supabase.co/functions/v1/make-server-c1ef5280

# Features
NEXT_PUBLIC_ENABLE_LOYALTY=true
NEXT_PUBLIC_ENABLE_CHATBOT=true
NEXT_PUBLIC_ENABLE_QR_CHECKIN=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# Environment
NODE_ENV=production
```

**Important:** Add these for **Production**, **Preview**, and **Development** environments!

#### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build (~2-5 minutes)
3. Done! 🎉

Your app will be live at: `https://sunest-auto.vercel.app`

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Setup and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? sunest-auto
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

---

## ⚡ Deploy Supabase Functions

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 2: Login to Supabase

```bash
supabase login
```

Browser will open → Login with your account

### Step 3: Link Project

```bash
supabase link --project-ref tvugghippwvoxsjqyxkr
```

Enter your database password when prompted.

### Step 4: Deploy Edge Function

```bash
# Deploy server function
supabase functions deploy make-server-c1ef5280

# Set secrets (if needed)
supabase secrets set MY_SECRET=value
```

### Step 5: Verify Deployment

Test endpoint:
```bash
curl https://tvugghippwvoxsjqyxkr.supabase.co/functions/v1/make-server-c1ef5280/health
```

Expected response:
```json
{
  "status": "ok",
  "version": "2.0.0"
}
```

---

## ⚙️ Configure Production Environment

### 1. Update Supabase Settings

#### A. Add Production URL to CORS

1. Supabase Dashboard → Settings → API
2. **Additional CORS allowed origins**:
   ```
   https://sunest-auto.vercel.app
   https://*.vercel.app
   ```
3. Click **Save**

#### B. Configure Auth Settings

1. Go to **Authentication** → **URL Configuration**
2. **Site URL**: `https://sunest-auto.vercel.app`
3. **Redirect URLs**: Add:
   ```
   https://sunest-auto.vercel.app/auth/callback
   https://sunest-auto.vercel.app/auth/confirm
   ```

#### C. Update Email Templates

1. Go to **Authentication** → **Email Templates**
2. Update URLs in:
   - Confirmation email
   - Reset password email
   - Magic link email

Replace `http://localhost:3000` with `https://sunest-auto.vercel.app`

### 2. Configure Custom Domain (Optional)

#### In Vercel:

1. Project Settings → **Domains**
2. Add domain: `sunest-auto.com`
3. Add DNS records (Vercel will show you)

#### In Supabase:

Update all URLs to use your custom domain.

---

## 📋 Post-deployment Tasks

### 1. Verify Everything Works

Test critical flows:
- [ ] User registration
- [ ] User login
- [ ] Customer booking
- [ ] Admin dashboard
- [ ] Real-time updates
- [ ] QR code generation
- [ ] Inventory management

### 2. Create Production Admin Account

```bash
# Option 1: Via Supabase Dashboard
# Go to Authentication → Users → Add User

# Option 2: Via registration flow
# Visit: https://sunest-auto.vercel.app/auth/register
```

Create admin:
```
Email: admin@sunest-auto.com
Password: <strong-password>
Role: admin
```

### 3. Seed Production Data (Optional)

```bash
# Connect to production database
SUPABASE_URL=https://tvugghippwvoxsjqyxkr.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your-key \
npm run seed
```

Or manually add initial:
- Service types
- Spare parts catalog
- Business hours
- Default settings

### 4. Setup Custom Analytics (Optional)

#### Google Analytics:

1. Create GA4 property
2. Get Measurement ID
3. Add to Vercel environment variables:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

#### Sentry Error Tracking:

1. Create Sentry project
2. Get DSN
3. Add to Vercel:
   ```
   SENTRY_DSN=https://xxx@sentry.io/xxx
   ```

### 5. Configure Notifications (When Ready)

#### Email (SendGrid):

```env
EMAIL_SERVICE_API_KEY=SG.xxxxx
EMAIL_FROM=noreply@sunest-auto.com
```

#### SMS (Twilio):

```env
SMS_API_KEY=ACxxxx
SMS_API_SECRET=xxxxx
SMS_FROM_NUMBER=+62xxx
```

---

## 📊 Monitoring & Maintenance

### 1. Monitor Performance

#### Vercel Analytics:

- Enable in Vercel dashboard
- View: Deployments → Analytics
- Check:
  - Page load times
  - Core Web Vitals
  - Traffic patterns

#### Supabase Monitoring:

- Dashboard → Database → Performance
- Check:
  - Query performance
  - Connection pooling
  - Storage usage

### 2. Setup Alerts

#### Vercel:

- Settings → Notifications
- Enable:
  - Deployment failures
  - Performance degradation

#### Supabase:

- Settings → Notifications
- Enable:
  - Database CPU high
  - Storage limit approaching

### 3. Regular Backups

#### Database:

```bash
# Backup via CLI
supabase db dump -f backup-$(date +%Y%m%d).sql

# Or via dashboard
# Database → Backups → Create backup
```

Schedule automated backups (daily recommended).

### 4. Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update to latest (carefully!)
npm update

# Test thoroughly after updates
npm run build
npm run dev
```

### 5. Monitor Logs

#### Vercel Logs:

```bash
# Install Vercel CLI
vercel logs

# Or view in dashboard
# Project → Deployments → [deployment] → Logs
```

#### Supabase Logs:

- Dashboard → Logs
- Filter by:
  - Database queries
  - API requests
  - Edge function logs

---

## 🔄 Continuous Deployment

### Setup Auto-deploy from GitHub

Vercel automatically deploys when you push to GitHub:

```bash
# Push to main branch = production deploy
git push origin main

# Push to other branches = preview deploy
git checkout -b feature/new-feature
git push origin feature/new-feature
```

### Preview Deployments

Every PR gets a preview URL:
- Test features before merging
- Share with team for review
- No impact on production

---

## 🔐 Security Checklist

- [ ] All API keys stored in environment variables
- [ ] Service role key NEVER exposed to frontend
- [ ] HTTPS enforced (auto by Vercel)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (Supabase)
- [ ] RLS (Row Level Security) policies active
- [ ] Strong admin passwords
- [ ] Email confirmation enabled
- [ ] Security headers configured

### Add Security Headers

Create `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};
```

---

## 🆘 Rollback Procedure

If deployment fails or has critical bugs:

### Quick Rollback (Vercel):

1. Go to Vercel dashboard
2. Deployments → Find previous working deployment
3. Click **"..."** → **"Promote to Production"**
4. Instant rollback!

### Database Rollback (if needed):

1. Go to Supabase → Database → Backups
2. Select backup before incident
3. Click **"Restore"**
4. Verify data integrity

---

## 📞 Support

Need help with deployment?

- 📖 Docs: `README.md` & `SETUP_GUIDE.md`
- 💬 Vercel: https://vercel.com/docs
- 💬 Supabase: https://supabase.com/docs
- 📧 Email: support@sunest-auto.com

---

## ✅ Deployment Checklist Summary

**Pre-deployment:**
- [ ] Code pushed to GitHub
- [ ] Build succeeds locally
- [ ] Environment variables ready

**Deployment:**
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Supabase functions deployed

**Configuration:**
- [ ] CORS updated
- [ ] Auth URLs updated
- [ ] Email templates updated
- [ ] Custom domain (optional)

**Post-deployment:**
- [ ] All features tested
- [ ] Admin account created
- [ ] Production data seeded
- [ ] Monitoring enabled
- [ ] Backups scheduled

**Security:**
- [ ] API keys secured
- [ ] HTTPS enforced
- [ ] Security headers added
- [ ] RLS policies active

---

**Congratulations! Your app is live! 🎉**

Made with ❤️ for Indonesian motorcycle workshops 🏍️
