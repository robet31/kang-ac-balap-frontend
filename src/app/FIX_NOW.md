# 🔥 FIX ERROR SEKARANG - 3 MENIT!

## ❌ Error Kamu:
```
PGRST204: Could not find the 'customer_name' column
```

## ✅ Artinya:
Column `customer_name`, `vehicle_name`, dan `package_name` **BELUM ADA** di database!

---

## 🚀 CARA FIX (3 Langkah):

### 1️⃣ BUKA SUPABASE

```
https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr
```

Klik link → Login (kalau perlu)

---

### 2️⃣ BUKA SQL EDITOR

- Sidebar kiri → Cari **"SQL Editor"**
- Klik **"New query"** (tombol hijau)

---

### 3️⃣ COPY-PASTE & RUN

**Copy 4 command ini (SEMUA):**

```sql
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS vehicle_name TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS package_name TEXT;
NOTIFY pgrst, 'reload schema';
```

**Paste di SQL Editor → Klik "RUN" (atau Ctrl+Enter)**

**Harus muncul:** ✅ "Success. No rows returned"

---

## ⏰ TUNGGU 30 DETIK

Setelah run SQL:
1. Tunggu **30 detik** (biar schema cache refresh)
2. **Refresh browser** (F5)
3. **Test create job** lagi
4. ✅ **HARUSNYA WORK!**

---

## 🧪 TEST:

1. Admin Dashboard → "Buat Job Baru"
2. Isi form:
   ```
   Atas Nama: Test
   Kendaraan: Test Vehicle
   Tanggal: Hari ini
   Waktu: 10:00
   ```
3. Klik "Buat Job Order"
4. ✅ Success! 🎉

---

## ❓ Masih Error?

Coba ini:

```sql
-- Check columns ada gak
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'jobs' 
AND column_name IN ('customer_name', 'vehicle_name', 'package_name');
```

**Harus muncul 3 rows:**
- customer_name
- package_name  
- vehicle_name

**Kalau muncul 3 rows tapi masih error:**

```sql
-- Force refresh
NOTIFY pgrst, 'reload schema';
```

Tunggu 30 detik → Refresh browser → Test lagi

---

## 🎯 Kenapa Error Ini?

**Simple explanation:**

```
Form kirim:     customer_name = "Sujadtmiko"
                     ↓
Database:       "customer_name? Gak ada column itu!"
                     ↓
Result:         ❌ ERROR!
```

**Setelah fix:**

```
Form kirim:     customer_name = "Sujadtmiko"
                     ↓
Database:       "OK! Saved to customer_name column"
                     ↓
Result:         ✅ SUCCESS!
```

---

## 📋 CHECKLIST:

```
[ ] Buka Supabase dashboard
[ ] Klik SQL Editor
[ ] Paste 4 SQL commands
[ ] Klik RUN
[ ] Lihat "Success" message
[ ] Tunggu 30 detik
[ ] Refresh browser (F5)
[ ] Test create job
[ ] ✅ WORK!
```

---

## 🆘 STUCK? Share This:

1. Screenshot SQL Editor setelah run command
2. Error message dari browser (F12 → Console)
3. Apakah muncul "Success" atau error?

---

## ⚡ SUPER QUICK VERSION:

**1 Command to Rule Them All:**

```sql
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS vehicle_name TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS package_name TEXT;
NOTIFY pgrst, 'reload schema';
```

**Copy → Paste di Supabase SQL Editor → RUN → Wait 30s → Test**

**DONE!** ✨

---

**Ini WAJIB dilakukan sebelum app bisa work! Tidak ada cara lain.** 🎯
