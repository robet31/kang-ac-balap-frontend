# ⚡ QUICK REFERENCE - SUNEST AUTO

Cheat sheet cepat untuk developer.

---

## 📦 Project Info

```yaml
Name: Sunest Auto
Version: 2.0.0
Framework: Next.js 14
Database: Supabase (PostgreSQL)
Supabase Project ID: tvugghippwvoxsjqyxkr
```

---

## 🚀 Quick Commands

```bash
# Setup pertama kali
npm install
cp .env.example .env.local
npm run check-env

# Development
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build production
npm run start            # Run production build
npm run lint             # Lint code
npm run type-check       # TypeScript check

# Database
npm run seed             # Seed data
```

---

## 🔑 Environment Variables

File: `.env.local` (buat dari `.env.example`)

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://tvugghippwvoxsjqyxkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 📁 Struktur File Penting

```
/App.tsx                        # Main app entry
/package.json                   # Dependencies
/.env.local                     # Environment vars (gitignored)
/.env.example                   # Template env vars

/components/                    # React components
  /admin/                       # Admin components
  /dashboard/                   # Customer components
  /ui/                          # Shadcn UI

/pages/                         # Next.js pages/routes
  /admin/                       # Admin pages
  /customer/                    # Customer pages

/utils/                         # Utilities
  /supabase/client.tsx          # Supabase client
  /api.tsx                      # API helpers

/database/                      # SQL scripts
  /COMPLETE_MIGRATION.sql       # Schema (run first!)
  /SEED_DATA.sql                # Initial data

/contexts/AuthContext.tsx       # Auth state
/styles/globals.css             # Global styles
```

---

## 🗄️ Database Quick Reference

### Tables (Real Supabase Tables)

```sql
profiles          -- User accounts (extends auth.users)
vehicles          -- Customer vehicles
services          -- Service packages
job_orders        -- Main job/booking records
job_parts         -- Parts used in jobs
inventory         -- Spare parts inventory
job_updates       -- Job status updates/notes
```

### Key Relationships

```
profiles → vehicles (1:N)
profiles → job_orders (1:N) [as customer]
vehicles → job_orders (1:N)
job_orders → job_parts (1:N)
inventory → job_parts (1:N)
```

### RLS (Row Level Security)

- **Enabled** on all tables
- **Customers**: Can only see own data
- **Admin**: Full access to everything
- Check `/database/COMPLETE_MIGRATION.sql` for policies

---

## 🔐 Authentication

### User Roles

```typescript
'customer'  // End users (default)
'admin'     // Workshop owner/manager
```

### Auth Flow

```typescript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Logout
await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

### Demo Accounts

```
Customer:
  Email: customer@test.com
  Password: customer123

Admin:
  Email: admin@sunest.com
  Password: admin123
```

---

## 🎨 Styling Cheat Sheet

### Tailwind Classes (Common)

```tsx
// Layout
flex flex-col gap-4 p-4 container mx-auto

// Responsive
hidden md:block lg:flex
text-sm md:text-base lg:text-lg

// Colors (defined in globals.css)
bg-primary text-primary-foreground
bg-secondary text-secondary-foreground
bg-destructive text-destructive-foreground

// Animations
animate-fade-in animate-slide-in-right
```

### Shadcn Components

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
```

---

## 📡 API Endpoints (Supabase Functions)

### Base URL

```
https://tvugghippwvoxsjqyxkr.supabase.co/functions/v1/make-server-c1ef5280
```

### Headers

```typescript
{
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
}
```

### Example Request

```typescript
const response = await fetch(
  `${API_URL}/bookings`,
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    }
  }
);
```

---

## 🐛 Debug Checklist

### App tidak jalan?

```bash
# 1. Check Node version
node --version  # Should be >= 18

# 2. Check env vars
npm run check-env

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 4. Clear Next.js cache
rm -rf .next

# 5. Restart dev server
npm run dev
```

### Supabase error?

```bash
# 1. Verify credentials in .env.local
# 2. Check Supabase project is active
# 3. Test connection:
curl https://tvugghippwvoxsjqyxkr.supabase.co

# 4. Check RLS policies in Supabase Dashboard
```

### Database error?

```sql
-- Run in Supabase SQL Editor:

-- 1. Check tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public';

-- 2. Check user profiles
SELECT * FROM profiles LIMIT 5;

-- 3. Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

---

## 📊 Pricing Logic (Important!)

```typescript
// Customer booking via dashboard
laborCost = 0;  // FREE (promo online)

// Admin booking (walk-in)
laborCost = 25000;  // Fixed Rp 25,000

// Parts cost (both)
partsCost = sum(job_parts.subtotal);

// Total
totalAmount = laborCost + partsCost;
```

---

## 🔄 Git Workflow

```bash
# Start feature
git checkout -b feature/nama-feature

# Commit changes
git add .
git commit -m "feat: add feature X"

# Push to remote
git push origin feature/nama-feature

# Create Pull Request on GitHub
```

### Commit Message Convention

```
feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code restructuring
test: adding tests
chore: maintenance
```

---

## 📚 Documentation Files

```
README.md                          # Main readme
SETUP_LENGKAP_PEMULA.md           # Lengkap untuk pemula (step-by-step)
CARA_MENJALANKAN_SINGKAT.md       # Quick start guide
KONFIGURASI_LENGKAP.md            # All configurations
QUICK_REFERENCE.md                # This file (cheat sheet)
SUNEST_AUTO_COMPLETE_PLANNING.md  # Complete planning doc
```

---

## 🆘 Help & Resources

### Internal Docs
- Full setup: `SETUP_LENGKAP_PEMULA.md`
- Configuration: `KONFIGURASI_LENGKAP.md`
- Planning: `SUNEST_AUTO_COMPLETE_PLANNING.md`

### External Resources
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind: https://tailwindcss.com/docs
- Shadcn: https://ui.shadcn.com

### Support
- GitHub Issues
- Email: support@sunest-auto.com

---

## ⚡ Performance Tips

```typescript
// 1. Use React memo for expensive components
const MemoComponent = React.memo(ExpensiveComponent);

// 2. Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'));

// 3. Optimize images
import Image from 'next/image';

// 4. Use Supabase indexes for queries
// Already created in COMPLETE_MIGRATION.sql

// 5. Limit realtime subscriptions
// Only subscribe to what you need
```

---

## 🔒 Security Checklist

- ✅ Never commit `.env.local` to Git
- ✅ Never expose `SUPABASE_SERVICE_ROLE_KEY` to frontend
- ✅ Use RLS policies for data access control
- ✅ Validate user input on frontend & backend
- ✅ Use HTTPS in production
- ✅ Sanitize user-generated content

---

**Last Updated**: February 2026
**Version**: 2.0.0
