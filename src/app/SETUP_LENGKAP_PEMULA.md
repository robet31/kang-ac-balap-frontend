# 🚀 SETUP LENGKAP SUNEST AUTO - PANDUAN PEMULA

Halo! Selamat datang di Sunest Auto. Ini adalah panduan lengkap untuk kamu yang baru pertama kali setup project web seperti ini. Tenang aja, aku akan jelaskan step by step dari nol banget! 💪

---

## 📚 Daftar Isi
1. [Apa yang Dibutuhkan](#apa-yang-dibutuhkan)
2. [Penjelasan Teknologi](#penjelasan-teknologi)
3. [Instalasi Tools](#instalasi-tools)
4. [Setup Project](#setup-project)
5. [Konfigurasi Supabase](#konfigurasi-supabase)
6. [Menjalankan Project](#menjalankan-project)
7. [Troubleshooting](#troubleshooting)

---

## 1️⃣ Apa yang Dibutuhkan

Sebelum mulai, kamu perlu beberapa hal ini:

### Software yang Harus Diinstall:
- ✅ **Node.js** (versi 18 atau lebih baru)
- ✅ **Git** (untuk download project)
- ✅ **Code Editor** (rekomendasi: VS Code)
- ✅ **Browser** (Chrome/Firefox/Edge)
- ✅ **Akun Supabase** (gratis)

### Koneksi Internet
- Diperlukan untuk install dependencies dan akses database

---

## 2️⃣ Penjelasan Teknologi

Biar kamu nggak bingung, ini penjelasan singkat teknologi yang kita pakai:

### 🎨 **Frontend (Tampilan Website)**
- **Next.js 14**: Framework React untuk bikin website. Seperti kerangka bangunan rumah.
- **React**: Library JavaScript untuk bikin UI interaktif
- **Tailwind CSS**: Tool untuk styling yang gampang banget
- **Shadcn UI**: Komponen UI yang sudah jadi (button, card, dll)
- **Framer Motion**: Untuk animasi smooth

### 🗄️ **Backend (Server & Database)**
- **Supabase**: Database + Authentication + Storage. Seperti "Firebase"-nya PostgreSQL
- **PostgreSQL**: Database untuk nyimpen data (customer, booking, inventory, dll)
- **Supabase Edge Functions**: Serverless functions untuk API

### 🔄 **Cara Kerjanya**
```
User → Browser → Next.js App → Supabase → PostgreSQL Database
                      ↓
                  Tampilan UI
```

---

## 3️⃣ Instalasi Tools

### A. Install Node.js

**Windows:**
1. Download dari https://nodejs.org/
2. Pilih versi LTS (Long Term Support)
3. Double click installer `.msi`
4. Klik Next → Next → Install
5. Tunggu sampai selesai

**Mac:**
1. Download dari https://nodejs.org/
2. Double click file `.pkg`
3. Follow installer
4. Atau pakai Homebrew: `brew install node`

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verifikasi Instalasi:**
```bash
node --version
# Output: v18.x.x atau lebih tinggi

npm --version
# Output: 9.x.x atau lebih tinggi
```

### B. Install Git

**Windows:**
1. Download dari https://git-scm.com/download/win
2. Install dengan setting default

**Mac:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt-get install git
```

**Verifikasi:**
```bash
git --version
# Output: git version 2.x.x
```

### C. Install VS Code (Code Editor)

1. Download dari https://code.visualstudio.com/
2. Install seperti biasa
3. Buka VS Code

**Extension yang Disarankan:**
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- Error Lens
- GitLens

---

## 4️⃣ Setup Project

### A. Download Project

**Jika Project Sudah di Git:**
```bash
# Clone project
git clone https://github.com/yourusername/sunest-auto.git

# Masuk ke folder project
cd sunest-auto
```

**Jika Project Lokal (Copy Manual):**
1. Copy seluruh folder project ke komputer kamu
2. Buka Terminal/Command Prompt
3. Navigate ke folder project:
```bash
cd /path/to/sunest-auto
```

### B. Install Dependencies (Library)

Ini adalah proses download semua library yang dibutuhkan project.

```bash
# Install semua dependencies
npm install
```

**Proses ini akan:**
- Download semua library di `package.json`
- Membuat folder `node_modules` (berisi semua library)
- Membuat file `package-lock.json` (lock versions)

**Tunggu sampai selesai** (biasanya 2-5 menit tergantung internet)

**Output yang Benar:**
```
added 324 packages, and audited 325 packages in 1m
found 0 vulnerabilities
```

---

## 5️⃣ Konfigurasi Supabase

### A. Buat Akun Supabase

1. Buka https://supabase.com/
2. Klik **Start your project**
3. Sign up dengan GitHub/Email
4. Verifikasi email kamu

### B. Buat Project Baru (Jika Belum Ada)

**PENTING:** Project ini sudah punya Supabase project: `sunest-auto-new` dengan ID `tvugghippwvoxsjqyxkr`

Kalau kamu mau pakai yang sudah ada:
- Minta akses ke project owner
- Dapatkan credentials (URL & Keys)

Kalau kamu mau buat project baru:
1. Klik **New Project**
2. Isi:
   - **Name**: Sunest Auto
   - **Database Password**: (buat password yang kuat, simpan baik-baik!)
   - **Region**: Southeast Asia (Singapore)
   - **Pricing Plan**: Free
3. Klik **Create new project**
4. Tunggu 2-3 menit sampai project selesai dibuat

### C. Dapatkan Credentials

1. Setelah project selesai, buka **Settings** (⚙️ icon di sidebar)
2. Pilih **API**
3. Kamu akan lihat:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public: eyJhbG...
service_role: eyJhbG... (⚠️ jangan bagikan ini!)
```

**CATAT BAIK-BAIK!** Kamu akan butuh ini di step berikutnya.

### D. Setup Database

Sekarang kita buat tables dan data di database.

1. Di Supabase Dashboard, klik **SQL Editor** (icon database di sidebar)
2. Klik **New query**

**Step 1: Jalankan Migration (Buat Tables)**
```sql
-- Copy semua isi dari file /database/COMPLETE_MIGRATION.sql
-- Paste ke SQL Editor
-- Klik "Run" atau tekan Ctrl+Enter
```

Tunggu sampai selesai. Kamu akan lihat:
```
Success. No rows returned
```

**Step 2: Jalankan Seed Data (Isi Data Awal)**
```sql
-- Copy semua isi dari file /database/SEED_DATA.sql
-- Paste ke SQL Editor baru
-- Klik "Run"
```

Kamu akan lihat:
```
SERVICES: 4
INVENTORY: 25
```

**Step 3: Buat Demo Users**

Karena kita tidak bisa langsung insert ke `auth.users`, kita harus create via Supabase Auth:

1. Buka **Authentication** → **Users**
2. Klik **Add user** → **Create new user**

**Admin User:**
- Email: `admin@sunest.com`
- Password: `admin123`
- Auto Confirm Email: ✅ (centang ini!)

Setelah user dibuat:
3. Klik user yang baru dibuat
4. Klik **User metadata** → **Edit**
5. Tambahkan:
```json
{
  "full_name": "Admin Sunest",
  "role": "admin"
}
```

**Customer User:**
- Email: `customer@test.com`
- Password: `customer123`
- User metadata:
```json
{
  "full_name": "Budi Santoso",
  "role": "customer"
}
```

Ulangi untuk user lainnya jika perlu.

### E. Konfigurasi Environment Variables

1. Di folder project, copy file `.env.example`:
```bash
cp .env.example .env.local
```

2. Buka file `.env.local` dengan code editor
3. Isi dengan credentials dari Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tvugghippwvoxsjqyxkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ⚠️ JANGAN COMMIT FILE INI KE GIT!
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

SUPABASE_DB_URL=postgresql://postgres:YOUR_PASSWORD@db.tvugghippwvoxsjqyxkr.supabase.co:5432/postgres
```

**Replace:**
- `YOUR_PASSWORD` dengan database password yang kamu buat tadi
- Copy paste exact keys dari Supabase dashboard

---

## 6️⃣ Menjalankan Project

Sekarang saatnya jalankan aplikasi! 🎉

### A. Development Mode (Local)

```bash
npm run dev
```

**Kamu akan lihat:**
```
   ▲ Next.js 14.0.0
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.xxx:3000

 ✓ Ready in 2.3s
```

### B. Buka di Browser

1. Buka browser
2. Akses: http://localhost:3000
3. Kamu akan lihat **Landing Page** Sunest Auto

### C. Test Login

**Login sebagai Customer:**
- Email: `customer@test.com`
- Password: `customer123`

**Login sebagai Admin:**
- Email: `admin@sunest.com`
- Password: `admin123`

### D. Perintah Lainnya

```bash
# Check environment variables
npm run check-env

# Run seed data (isi data dummy)
npm run seed

# Build untuk production
npm run build

# Jalankan production build
npm run start

# Lint code (check errors)
npm run lint

# Type checking
npm run type-check
```

---

## 7️⃣ Troubleshooting

### ❌ Error: `npm: command not found`
**Solusi:** Node.js belum terinstall atau belum ada di PATH
```bash
# Cek instalasi
node --version

# Jika tidak ada, install ulang Node.js
```

### ❌ Error: `Cannot find module 'next'`
**Solusi:** Dependencies belum terinstall
```bash
# Hapus node_modules dan package-lock.json
rm -rf node_modules package-lock.json

# Install ulang
npm install
```

### ❌ Error: `Supabase client error: Invalid API key`
**Solusi:** Environment variables salah atau tidak terbaca
1. Pastikan file `.env.local` ada di root folder
2. Restart development server (`Ctrl+C` lalu `npm run dev` lagi)
3. Clear cache: `rm -rf .next`

### ❌ Error: `Failed to fetch` atau `Network Error`
**Solusi:** Supabase credentials salah
1. Cek kembali `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Pastikan project Supabase sudah aktif
3. Cek koneksi internet

### ❌ Error: `relation "profiles" does not exist`
**Solusi:** Database migrations belum dijalankan
1. Buka Supabase SQL Editor
2. Jalankan `/database/COMPLETE_MIGRATION.sql`

### ❌ Error: `Port 3000 already in use`
**Solusi:** Port 3000 sudah dipakai aplikasi lain
```bash
# Pakai port lain
PORT=3001 npm run dev

# Atau kill process yang pakai port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

### ❌ Error: `Authentication failed` saat login
**Solusi:**
1. Pastikan user sudah dibuat di Supabase Auth
2. Cek email dan password benar
3. Pastikan user metadata (`role`) sudah diset
4. Cek RLS policies di Supabase

### ❌ Tampilan berantakan / CSS tidak muncul
**Solusi:**
```bash
# Clear .next cache
rm -rf .next

# Restart dev server
npm run dev
```

---

## 🎯 Struktur Folder Project

```
sunest-auto/
├── components/           # Komponen React UI
│   ├── admin/           # Komponen khusus admin
│   ├── dashboard/       # Komponen customer dashboard
│   ├── dialogs/         # Modal/dialog components
│   └── ui/              # Shadcn UI components
├── pages/               # Next.js pages (routes)
│   ├── admin/           # Admin pages
│   └── customer/        # Customer pages
├── utils/               # Utility functions
│   └── supabase/        # Supabase client config
├── hooks/               # Custom React hooks
├── contexts/            # React contexts (AuthContext)
├── database/            # SQL migration files
│   ├── COMPLETE_MIGRATION.sql
│   └── SEED_DATA.sql
├── styles/              # Global CSS
│   └── globals.css
├── public/              # Static assets (images, icons)
├── supabase/            # Supabase edge functions
│   └── functions/
│       └── server/      # API endpoints
├── .env.local           # Environment variables (JANGAN COMMIT!)
├── .env.example         # Template env variables
├── package.json         # Dependencies & scripts
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS config
└── tsconfig.json        # TypeScript config
```

---

## 📝 Catatan Penting

### ⚠️ JANGAN Commit File-file Ini ke Git:
```
.env.local
.env
node_modules/
.next/
*.log
.DS_Store
```

Pastikan file `.gitignore` sudah berisi semua ini!

### 🔐 Keamanan:
- **JANGAN** share `SUPABASE_SERVICE_ROLE_KEY` dengan siapa pun
- **JANGAN** commit credentials ke GitHub
- Gunakan environment variables untuk semua secrets
- Production: gunakan platform secrets (Vercel Env, Netlify Env)

### 💾 Backup Database:
```bash
# Export database
npx supabase db dump -f backup.sql

# Restore database
psql -h db.tvugghippwvoxsjqyxkr.supabase.co -U postgres < backup.sql
```

---

## 🚀 Deployment ke Production

### Deploy ke Vercel (Recommended):

1. Push project ke GitHub
2. Buka https://vercel.com
3. Import project dari GitHub
4. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (Jangan set `SUPABASE_SERVICE_ROLE_KEY` di frontend!)
5. Deploy!

### Deploy ke Netlify:

1. Push ke GitHub
2. Buka https://netlify.com
3. Import project
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Set environment variables

---

## 📚 Resources & Learning

### Dokumentasi Official:
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React: https://react.dev

### Tutorial Bahasa Indonesia:
- Web Programming UNPAS (YouTube)
- Programmer Zaman Now
- Kelas Terbuka

### Community:
- Discord: Supabase Indonesia
- Facebook: React Indonesia
- Stack Overflow

---

## ❓ FAQ (Frequently Asked Questions)

**Q: Apakah project ini gratis?**
A: Ya! Semua teknologi yang dipakai punya free tier yang cukup untuk development dan small-scale production.

**Q: Butuh berapa lama untuk setup pertama kali?**
A: Sekitar 30-60 menit jika mengikuti panduan ini step by step.

**Q: Apakah harus paham programming dulu?**
A: Basic knowledge HTML, CSS, JavaScript sangat membantu. Tapi panduan ini dibuat untuk pemula yang mau belajar.

**Q: Bisa jalan di laptop spesifikasi rendah?**
A: Ya, minimum RAM 4GB sudah cukup untuk development.

**Q: Database pakai apa?**
A: PostgreSQL via Supabase. Sudah termasuk hosting gratis.

**Q: Gimana cara update project?**
A: `git pull origin main` lalu `npm install` untuk update dependencies.

---

## 🆘 Butuh Bantuan?

Jika kamu stuck atau ada error:

1. **Baca error message** dengan teliti
2. **Google error message** tersebut
3. Cek bagian **Troubleshooting** di atas
4. Tanya di community Discord/Forum
5. Stack Overflow
6. GitHub Issues (jika project public)

---

## ✅ Checklist Setup

Gunakan checklist ini untuk memastikan semua sudah beres:

```
[ ] Node.js terinstall (v18+)
[ ] Git terinstall
[ ] VS Code terinstall + extensions
[ ] Project sudah di-download/clone
[ ] npm install berhasil
[ ] Akun Supabase sudah dibuat
[ ] Supabase project sudah dibuat
[ ] Database migrations sudah dijalankan
[ ] Seed data sudah diisi
[ ] Demo users sudah dibuat
[ ] .env.local sudah dikonfigurasi
[ ] npm run dev berhasil jalan
[ ] Bisa buka http://localhost:3000
[ ] Bisa login sebagai customer
[ ] Bisa login sebagai admin
```

---

## 🎉 Selamat!

Jika kamu sudah sampai sini dan semua checklist ✅, artinya project kamu sudah jalan dengan baik!

Sekarang kamu bisa:
- ✅ Explore fitur-fitur yang ada
- ✅ Coba booking service
- ✅ Lihat dashboard customer
- ✅ Manage job orders di admin dashboard
- ✅ Mulai custom sesuai kebutuhan

**Happy Coding!** 🚀💻

---

**Dibuat dengan ❤️ untuk Sunest Auto**
**Version: 2.0.0**
**Last Updated: {{ DATE }}**
