# 🚀 START HERE - Sunest Auto Quick Guide

**Selamat datang!** File ini adalah **starting point** Anda untuk menjalankan Sunest Auto.

---

## 🎯 TLDR - CARA TERCEPAT (5 Menit)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env.local

# 3. Edit .env.local → Paste Supabase keys
# Get keys from: https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/settings/api

# 4. Run app
npm run dev

# 5. Open browser
# http://localhost:3000
```

**Done! 🎉**

---

## 📚 DOKUMENTASI - BACA YANG MANA?

### 1️⃣ **PERTAMA KALI SETUP** (MULAI DI SINI!)
📄 **`CARA_MENJALANKAN.md`** (Bahasa Indonesia)
- Step-by-step lengkap dari install sampai running
- Termasuk troubleshooting
- **BACA INI DULU!** ⭐⭐⭐

### 2️⃣ **PAHAMI FITUR & PLANNING**
📄 **`SUNEST_AUTO_COMPLETE_PLANNING.md`**
- Complete planning (80+ halaman)
- Semua fitur: Customer & Admin
- Database schema
- Business rules
- API endpoints
- UI/UX design
- **MUST READ untuk development!** ⭐⭐⭐

### 3️⃣ **QUICK REFERENCE**
📄 **`README.md`**
- Overview project (English)
- Features list
- Tech stack
- Project structure

### 4️⃣ **DEPLOYMENT**
📄 **`DEPLOYMENT.md`**
- Production deployment guide
- Vercel setup
- Environment configuration
- **Baca saat mau deploy ke production**

### 5️⃣ **TROUBLESHOOTING**
📄 **`CARA_MENJALANKAN.md`** → Section "TROUBLESHOOTING"
- Common errors & solutions

---

## 🔑 KONFIGURASI YANG WAJIB

### File: `.env.local`

**Cara buat:**
```bash
cp .env.example .env.local
```

**Yang WAJIB diisi:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://tvugghippwvoxsjqyxkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-key-dari-dashboard
SUPABASE_SERVICE_ROLE_KEY=paste-key-dari-dashboard
```

**Cara dapat keys:**
1. Login: https://supabase.com/dashboard
2. Select project: **sunest-auto-new**
3. Settings → API
4. Copy **anon** dan **service_role** keys
5. Paste ke `.env.local`

---

## 🏃 CARA JALANKAN

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Check configuration
npm run check-env

# Seed sample data
npm run seed
```

**Access app:**
- Local: http://localhost:3000
- Customer: http://localhost:3000/customer/dashboard
- Admin: http://localhost:3000/admin/dashboard

---

## 👤 AKUN TEST

### Buat via Supabase Dashboard:

1. https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/auth/users
2. Add user → Create new user
3. Email: `admin@test.com`
4. Password: `admin123456`
5. Auto Confirm: ✅ **CENTANG!**

**Atau buat via app:**
http://localhost:3000/auth/register

---

## 📁 FILE STRUCTURE

```
sunest-auto/
├── 📚 DOKUMENTASI (BACA INI!)
│   ├── START_HERE.md                        ← You are here! ⭐
│   ├── CARA_MENJALANKAN.md                  ← Setup guide (ID) ⭐⭐⭐
│   ├── SUNEST_AUTO_COMPLETE_PLANNING.md     ← Complete planning ⭐⭐⭐
│   ├── README.md                            ← Overview (EN)
│   ├── QUICK_START.md                       ← 5 min quick start
│   ├── SETUP_GUIDE.md                       ← Detailed setup (EN)
│   ├── DEPLOYMENT.md                        ← Production deploy
│   └── FILES_OVERVIEW.md                    ← Files explanation
│
├── ⚙️ KONFIGURASI (EDIT INI!)
│   ├── .env.example                         ← Template
│   ├── .env.local                           ← YOUR CONFIG (create this!) ⭐
│   ├── package.json                         ← Dependencies & scripts
│   └── .gitignore                           ← Git ignore rules
│
├── 🛠️ SCRIPTS
│   ├── scripts/check-env.js                 ← Verify .env.local
│   └── scripts/seed-data.js                 ← Seed sample data
│
└── 💻 CODE
    ├── pages/                               ← Next.js pages
    ├── components/                          ← React components
    ├── utils/                               ← Helper functions
    └── styles/                              ← CSS styles
```

---

## 🎯 LANGKAH BERIKUTNYA

### ✅ Checklist Setup:

**Persiapan:**
- [ ] Node.js >= 18.0.0 installed
- [ ] npm installed
- [ ] Git installed
- [ ] Supabase account ready

**Setup:**
- [ ] `npm install` selesai
- [ ] `.env.local` dibuat
- [ ] Supabase keys sudah di-paste
- [ ] `npm run check-env` sukses

**Running:**
- [ ] `npm run dev` jalan
- [ ] http://localhost:3000 bisa dibuka
- [ ] Akun test dibuat
- [ ] Bisa login

**Learning:**
- [ ] Baca `CARA_MENJALANKAN.md`
- [ ] Baca `SUNEST_AUTO_COMPLETE_PLANNING.md`
- [ ] Explore features
- [ ] Test customer & admin flow

---

## 🆘 MASALAH?

### Error umum & solusi:

**1. `npm install` gagal**
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules
npm install
```

**2. "Failed to fetch" error**
```bash
# Check .env.local
npm run check-env

# Restart server
# Ctrl+C
rm -rf .next
npm run dev
```

**3. Port 3000 sudah dipakai**
```bash
# Kill process (Windows)
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Or change port
# Edit package.json: "dev": "next dev -p 3001"
```

**Masih error?**
→ Baca `CARA_MENJALANKAN.md` section "TROUBLESHOOTING"

---

## 🌟 FITUR UTAMA

### 👤 CUSTOMER:
- ✅ Online booking (service fee Rp 0 - GRATIS!)
- ✅ Real-time job tracking
- ✅ Loyalty program (free oil tiap 4x service)
- ✅ QR check-in
- ✅ Vehicle management
- ✅ Service history & invoices
- ✅ Wanda AI Chatbot (Indonesian)

### 🔧 ADMIN:
- ✅ Complete dashboard dengan analytics
- ✅ Booking management (calendar, queue)
- ✅ Customer CRM dengan segmentation
- ✅ Inventory management (spare parts)
- ✅ Technician management
- ✅ Loyalty program management
- ✅ Financial reports & charts
- ✅ Chatbot management

**Detail semua fitur:**
→ `SUNEST_AUTO_COMPLETE_PLANNING.md`

---

## 🔗 QUICK LINKS

### Supabase Dashboard:
https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr

**Sections:**
- **Settings → API**: Get keys
- **Authentication → Users**: Manage users
- **Database → Tables**: View data
- **Logs**: Debug issues

### Local URLs:
- Landing: http://localhost:3000
- Login: http://localhost:3000/auth/login
- Register: http://localhost:3000/auth/register
- Customer Dashboard: http://localhost:3000/customer/dashboard
- Admin Dashboard: http://localhost:3000/admin/dashboard

---

## 💡 TIPS

1. **Gunakan VS Code**
   - Install extension: ESLint, Prettier, Tailwind CSS IntelliSense

2. **Buka 2 terminals**
   - Terminal 1: `npm run dev` (running server)
   - Terminal 2: untuk command lain

3. **Hot Reload**
   - Setiap save file, app auto-reload
   - Tidak perlu restart server

4. **Browser DevTools (F12)**
   - Console: lihat error
   - Network: lihat API calls
   - Application: lihat localStorage

5. **Seed sample data**
   ```bash
   npm run seed
   ```
   Untuk testing tanpa manual input

---

## 📞 SUPPORT

**Butuh bantuan?**

- 📖 Baca: `CARA_MENJALANKAN.md`
- 📖 Planning: `SUNEST_AUTO_COMPLETE_PLANNING.md`
- 📧 Email: support@sunest-auto.com
- 💬 WhatsApp: +62 812-3456-7890

---

## 🎉 SELAMAT CODING!

Semua konfigurasi sudah siap. Tinggal:

1. ✅ `npm install`
2. ✅ Copy `.env.example` → `.env.local`
3. ✅ Paste Supabase keys
4. ✅ `npm run dev`
5. ✅ Buka http://localhost:3000

**Enjoy building with Sunest Auto! 🏍️✨**

---

**Versi:** 2.0.0  
**Update:** 7 Februari 2026  
**Dibuat dengan ❤️ untuk bengkel motor Indonesia**
