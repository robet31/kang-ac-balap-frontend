# 🚀 CARA MENJALANKAN SUNEST AUTO DI LOKAL

Panduan lengkap dalam Bahasa Indonesia untuk menjalankan Sunest Auto di komputer lokal Anda.

---

## 📦 Yang Anda Butuhkan

Sebelum mulai, install software berikut:

### 1. Node.js (Wajib)
- **Download**: https://nodejs.org/
- **Versi**: Minimal 18.0.0
- **Cara cek**: Buka terminal/CMD, ketik `node --version`

### 2. Git (Wajib)
- **Download**: https://git-scm.com/
- **Cara cek**: Ketik `git --version` di terminal

### 3. Akun Supabase (Wajib)
- **Daftar gratis**: https://supabase.com/
- Project sudah dibuat: **sunest-auto-new** (ID: tvugghippwvoxsjqyxkr)

### 4. Code Editor (Opsional tapi disarankan)
- **VS Code**: https://code.visualstudio.com/

---

## 🎯 LANGKAH 1: Download & Install Dependencies

### A. Clone/Download Project

**Opsi 1: Via Git (Disarankan)**
```bash
# Buka terminal/CMD
git clone https://github.com/yourusername/sunest-auto.git
cd sunest-auto
```

**Opsi 2: Download ZIP**
1. Download ZIP dari GitHub
2. Extract ke folder
3. Buka terminal/CMD di folder tersebut

### B. Install Dependencies

```bash
# Jalankan perintah ini (tunggu 2-5 menit)
npm install
```

Akan download semua library yang dibutuhkan (~350 packages).

---

## 🔑 LANGKAH 2: Konfigurasi Supabase

### A. Login ke Supabase

1. Buka https://supabase.com/dashboard
2. Login dengan akun Anda
3. Klik project: **sunest-auto-new**

### B. Dapatkan API Keys

1. Di dashboard Supabase, klik **Settings** (icon ⚙️)
2. Klik **API** di sidebar
3. Copy 2 keys ini:

```
Project URL:
https://tvugghippwvoxsjqyxkr.supabase.co

anon public key:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsIn...
(Key panjang, copy semua!)

service_role key:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsIn...
(Key panjang, copy semua!)
```

### C. Enable Realtime (Penting!)

1. Klik **Database** → **Replication**
2. Cari table: `kv_store_c1ef5280`
3. Toggle **Realtime** ke ON
4. Klik **Save**

---

## ⚙️ LANGKAH 3: Setup Environment Variables

### A. Buat File `.env.local`

```bash
# Jalankan perintah ini
cp .env.example .env.local
```

Atau manual:
1. Copy file `.env.example`
2. Rename jadi `.env.local`

### B. Edit File `.env.local`

Buka file `.env.local` dengan text editor, isi seperti ini:

```env
# ============================================
# WAJIB DIISI - Dari Supabase Dashboard
# ============================================

NEXT_PUBLIC_SUPABASE_URL=https://tvugghippwvoxsjqyxkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-anon-key-kamu-disini
SUPABASE_SERVICE_ROLE_KEY=paste-service-role-key-kamu-disini

# ============================================
# WAJIB DIISI - Info Project
# ============================================

NEXT_PUBLIC_PROJECT_ID=tvugghippwvoxsjqyxkr
NEXT_PUBLIC_PROJECT_NAME=sunest-auto-new

# ============================================
# WAJIB DIISI - URL App
# ============================================

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://tvugghippwvoxsjqyxkr.supabase.co/functions/v1/make-server-c1ef5280

# ============================================
# OPSIONAL - Fitur Yang Diaktifkan
# ============================================

NEXT_PUBLIC_ENABLE_LOYALTY=true
NEXT_PUBLIC_ENABLE_CHATBOT=false
NEXT_PUBLIC_ENABLE_QR_CHECKIN=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=false

# ============================================
# DEVELOPMENT
# ============================================

NODE_ENV=development
```

**⚠️ PENTING:**
- Paste **ANON KEY** yang sudah di-copy tadi
- Paste **SERVICE ROLE KEY** yang sudah di-copy
- Jangan ubah yang lain kecuali tahu apa yang dilakukan

### C. Cek Konfigurasi (Opsional)

```bash
# Test apakah environment variables sudah benar
npm run check-env
```

Jika sukses, akan muncul:
```
✅ All required environment variables are set!
```

---

## 🚀 LANGKAH 4: Jalankan Aplikasi

### A. Start Development Server

```bash
npm run dev
```

**Output yang diharapkan:**
```
> sunest-auto@2.0.0 dev
> next dev

   ▲ Next.js 14.0.0
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.100:3000

 ✓ Ready in 3.2s
```

### B. Buka di Browser

1. Buka browser (Chrome/Firefox/Edge)
2. Ketik di address bar: `http://localhost:3000`
3. Anda akan lihat halaman landing Sunest Auto! 🎉

---

## 👤 LANGKAH 5: Buat Akun Test

### Opsi 1: Via Aplikasi

1. Buka: http://localhost:3000/auth/register
2. Isi form registrasi:
   ```
   Nama: Test User
   Email: test@example.com
   Phone: 081234567890
   Password: test123456
   ```
3. Klik **Daftar**
4. Jika diminta konfirmasi email:
   - Login ke Supabase Dashboard
   - **Authentication** → **Users**
   - Klik user baru → **Confirm Email**

### Opsi 2: Via Supabase Dashboard (Lebih Cepat)

1. Login Supabase Dashboard
2. **Authentication** → **Users**
3. Klik **Add user** → **Create new user**
4. Isi:
   ```
   Email: admin@test.com
   Password: admin123456
   Auto Confirm User: ✅ CENTANG INI!
   ```
5. Klik **Create user**
6. Ulangi untuk customer account

**Akun Test yang Disarankan:**

**Admin:**
```
Email: admin@test.com
Password: admin123456
```

**Customer:**
```
Email: customer@test.com
Password: customer123456
```

---

## 🧪 LANGKAH 6: Test Fitur (Opsional)

### A. Test Customer Flow

1. **Login**: http://localhost:3000/auth/login
   - Email: customer@test.com
   - Password: customer123456

2. **Dashboard Customer**: http://localhost:3000/customer/dashboard
   - Lihat statistik
   - Loyalty progress

3. **Tambah Kendaraan**:
   - Klik "Kendaraan Saya"
   - Klik "Tambah Kendaraan"
   - Isi: Yamaha NMAX, B 1234 XYZ

4. **Booking Service**:
   - Klik "Booking Service Baru"
   - Pilih kendaraan
   - Pilih "Oil Change"
   - Pilih tanggal besok
   - Submit booking

5. **Track Progress**:
   - Dashboard → Service Aktif
   - Klik job untuk lihat progress

### B. Test Admin Flow

1. **Login**: http://localhost:3000/auth/login
   - Email: admin@test.com
   - Password: admin123456

2. **Dashboard Admin**: http://localhost:3000/admin/dashboard
   - Lihat stats & charts
   - Lihat queue real-time

3. **Buat Job Manual**:
   - Klik "Buat Job Baru"
   - Isi customer & kendaraan
   - Submit

4. **Manage Inventory**:
   - Klik "Inventory"
   - Tambah spare part
   - Update stock

---

## 📊 LANGKAH 7: Isi Sample Data (Opsional)

Untuk testing lebih mudah, isi sample data:

```bash
npm run seed
```

Ini akan menambahkan:
- ✅ 2 customers
- ✅ 3 kendaraan
- ✅ 3 spare parts
- ✅ 2 teknisi

---

## 🌐 AKSES APLIKASI

Setelah `npm run dev` berjalan:

### URL Utama:

```
Landing Page:
http://localhost:3000

Customer:
http://localhost:3000/auth/login
http://localhost:3000/customer/dashboard
http://localhost:3000/customer/booking/new
http://localhost:3000/customer/vehicles
http://localhost:3000/customer/loyalty

Admin:
http://localhost:3000/auth/login
http://localhost:3000/admin/dashboard
http://localhost:3000/admin/bookings
http://localhost:3000/admin/customers
http://localhost:3000/admin/inventory
http://localhost:3000/admin/technicians
http://localhost:3000/admin/loyalty
http://localhost:3000/admin/reports
```

---

## 🛠️ TROUBLESHOOTING

### Problem 1: `npm install` Gagal

**Error:**
```
npm ERR! code EACCES
npm ERR! permission denied
```

**Solusi:**
```bash
# Windows: Jalankan CMD as Administrator
# Mac/Linux: Gunakan sudo
sudo npm install
```

### Problem 2: Port 3000 Sudah Dipakai

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solusi:**

**Windows:**
```bash
# Kill process di port 3000
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

**Mac/Linux:**
```bash
# Kill process di port 3000
lsof -ti:3000 | xargs kill -9
```

Atau ubah port di `package.json`:
```json
"dev": "next dev -p 3001"
```

### Problem 3: "Failed to fetch" Error

**Error:**
```
Failed to fetch bookings
NetworkError when attempting to fetch resource
```

**Solusi:**

1. **Cek `.env.local` sudah benar:**
   ```bash
   npm run check-env
   ```

2. **Cek Supabase online:**
   - Buka https://tvugghippwvoxsjqyxkr.supabase.co
   - Jika tidak bisa akses, cek internet

3. **Restart dev server:**
   ```bash
   # Tekan Ctrl+C untuk stop
   # Hapus cache
   rm -rf .next
   # Jalankan lagi
   npm run dev
   ```

### Problem 4: "Unauthorized" Error

**Error:**
```
Error: Unauthorized
Status: 401
```

**Solusi:**

1. **Regenerate API keys:**
   - Dashboard Supabase → Settings → API
   - Klik "Reset" untuk keys
   - Update di `.env.local`

2. **Clear browser storage:**
   - Buka Developer Tools (F12)
   - Application → Local Storage → Clear
   - Login ulang

### Problem 5: Database Error

**Error:**
```
relation "kv_store_c1ef5280" does not exist
```

**Solusi:**

1. **Buat table di Supabase:**
   - Dashboard → Database → SQL Editor
   - New Query
   - Paste dan run:

```sql
CREATE TABLE IF NOT EXISTS kv_store_c1ef5280 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_key_prefix ON kv_store_c1ef5280(key text_pattern_ops);
CREATE INDEX idx_updated_at ON kv_store_c1ef5280(updated_at DESC);
```

---

## 🔄 STOP & RESTART SERVER

### Stop Server:
```
Tekan Ctrl+C di terminal
```

### Restart Server:
```bash
npm run dev
```

### Build Production:
```bash
npm run build
npm start
```

---

## 📂 STRUKTUR PROJECT

```
sunest-auto/
├── pages/                 # Halaman aplikasi
│   ├── admin/            # Admin dashboard
│   ├── customer/         # Customer portal
│   └── auth/             # Login/Register
│
├── components/           # React components
│   ├── ui/              # Shadcn UI
│   └── admin/           # Admin components
│
├── utils/               # Helper functions
│   └── supabase/        # Supabase client
│
├── styles/              # CSS
│   └── globals.css      # Tailwind CSS
│
├── .env.local           # Environment variables (JANGAN COMMIT!)
├── .env.example         # Template env
├── package.json         # Dependencies
└── README.md            # Dokumentasi
```

---

## 📚 DOKUMENTASI LENGKAP

File-file dokumentasi:

- **README.md** - Overview & fitur lengkap
- **SETUP_GUIDE.md** - Panduan setup detail
- **QUICK_START.md** - Quick start 5 menit
- **DEPLOYMENT.md** - Cara deploy ke production
- **SUNEST_AUTO_COMPLETE_PLANNING.md** - Planning lengkap semua fitur

---

## 💡 TIPS

### 1. Gunakan VS Code
- Install extension: ESLint, Prettier, Tailwind CSS IntelliSense
- Otomatis format code

### 2. Buka Multiple Terminals
- Terminal 1: `npm run dev` (server)
- Terminal 2: untuk command lain (git, npm, dll)

### 3. Hot Reload
- Setiap kali save file, app otomatis reload
- Tidak perlu restart server

### 4. Browser DevTools
- Tekan F12 untuk buka DevTools
- Console: lihat error
- Network: lihat API calls
- Application: lihat localStorage

---

## 🆘 BUTUH BANTUAN?

### Dokumentasi:
- 📖 README.md - Overview
- 📖 SETUP_GUIDE.md - Setup detail
- 📖 SUNEST_AUTO_COMPLETE_PLANNING.md - Planning lengkap

### Online Resources:
- 🌐 Next.js Docs: https://nextjs.org/docs
- 🌐 Supabase Docs: https://supabase.com/docs
- 🌐 Tailwind CSS: https://tailwindcss.com/docs

### Contact:
- 📧 Email: support@sunest-auto.com
- 💬 WhatsApp: +62 812-3456-7890

---

## ✅ CHECKLIST

**Setup:**
- [ ] Node.js terinstall (>= 18.0.0)
- [ ] Git terinstall
- [ ] Project di-clone/download
- [ ] `npm install` berhasil
- [ ] Akun Supabase ada
- [ ] API keys sudah di-copy

**Konfigurasi:**
- [ ] File `.env.local` dibuat
- [ ] API keys di-paste di `.env.local`
- [ ] Realtime di-enable di Supabase

**Running:**
- [ ] `npm run dev` jalan
- [ ] http://localhost:3000 bisa dibuka
- [ ] Akun test sudah dibuat
- [ ] Bisa login

**Testing:**
- [ ] Customer flow tested
- [ ] Admin flow tested
- [ ] Sample data di-seed (opsional)

---

## 🎉 SELAMAT!

Aplikasi Sunest Auto sudah berjalan di lokal Anda!

**Langkah selanjutnya:**
1. ✅ Eksplor semua fitur
2. ✅ Customize sesuai kebutuhan
3. ✅ Baca planning lengkap di `SUNEST_AUTO_COMPLETE_PLANNING.md`
4. ✅ Deploy ke production (lihat `DEPLOYMENT.md`)

---

**Dibuat dengan ❤️ untuk bengkel motor Indonesia** 🏍️✨

**Versi:** 2.0.0  
**Terakhir Update:** 7 Februari 2026
