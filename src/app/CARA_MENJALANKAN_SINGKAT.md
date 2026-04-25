# ⚡ CARA MENJALANKAN SUNEST AUTO - QUICK START

Panduan singkat untuk menjalankan project di lokal.

---

## 🎯 Prerequisites (Yang Harus Ada)

- ✅ Node.js 18+ dan npm 9+
- ✅ Git
- ✅ Code editor (VS Code recommended)
- ✅ Akun Supabase (gratis)

---

## 🚀 Quick Start (5 Langkah)

### 1️⃣ Download Project

```bash
# Clone dari GitHub
git clone https://github.com/yourusername/sunest-auto.git
cd sunest-auto

# Atau jika sudah punya folder project, masuk ke folder:
cd /path/to/sunest-auto
```

### 2️⃣ Install Dependencies

```bash
npm install
```

Tunggu 2-5 menit sampai selesai.

### 3️⃣ Setup Environment Variables

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local dengan code editor
# Isi dengan Supabase credentials kamu
```

Isi file `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tvugghippwvoxsjqyxkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 4️⃣ Setup Database Supabase

1. Buka https://supabase.com/dashboard
2. Pilih project `sunest-auto-new` (atau buat baru)
3. Klik **SQL Editor**
4. Run file `/database/COMPLETE_MIGRATION.sql` (buat tables)
5. Run file `/database/SEED_DATA.sql` (isi data awal)
6. Buat demo users di **Authentication** → **Add user**:
   - Admin: `admin@sunest.com` / `admin123`
   - Customer: `customer@test.com` / `customer123`
   - Set user metadata dengan role (`admin` atau `customer`)

### 5️⃣ Jalankan Development Server

```bash
npm run dev
```

Buka browser: http://localhost:3000

---

## ✅ Verifikasi

Pastikan semua berjalan dengan baik:

```bash
# Test 1: Environment variables
npm run check-env

# Test 2: Buka browser
# http://localhost:3000

# Test 3: Login
# Email: customer@test.com
# Password: customer123
```

---

## 🎯 Demo Accounts

### Customer
```
Email: customer@test.com
Password: customer123
Access: Customer Dashboard
```

### Admin
```
Email: admin@sunest.com
Password: admin123
Access: Admin Dashboard (full access)
```

---

## 📝 Perintah NPM yang Berguna

```bash
# Development (http://localhost:3000)
npm run dev

# Production build
npm run build
npm run start

# Check environment
npm run check-env

# Lint & type check
npm run lint
npm run type-check

# Seed dummy data
npm run seed
```

---

## ❌ Troubleshooting Cepat

### Error: `npm: command not found`
→ Install Node.js dari https://nodejs.org/

### Error: `Cannot find module 'next'`
→ Jalankan `npm install` lagi

### Error: `Supabase client error`
→ Cek `.env.local` sudah benar, restart server

### Error: `Port 3000 already in use`
→ Jalankan dengan port lain: `PORT=3001 npm run dev`

### Error: Database tables tidak ada
→ Jalankan migration SQL di Supabase SQL Editor

---

## 📚 Dokumentasi Lengkap

Untuk panduan detail step-by-step, lihat:
- 📖 **SETUP_LENGKAP_PEMULA.md** - Panduan lengkap untuk pemula
- 📦 **KONFIGURASI_LENGKAP.md** - Semua konfigurasi & tech stack

---

## 🆘 Butuh Bantuan?

- Read: `/SETUP_LENGKAP_PEMULA.md`
- Check: Troubleshooting section
- Google: Error message yang muncul
- Ask: GitHub Issues / Community Forum

---

**Happy Coding! 🚀**
