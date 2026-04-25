# 🚀 QUICK FIX - 2 Menit!

## ❌ Error Saat Ini:
```
Could not find the 'customer_name' column of 'jobs' in the schema cache
```

---

## ✅ Solusi Cepat (Copy-Paste):

### 1️⃣ Buka Supabase Dashboard
```
https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr
```

### 2️⃣ Klik "SQL Editor" (Sidebar Kiri)

### 3️⃣ Klik "New Query"

### 4️⃣ Copy-Paste SQL Ini:

```sql
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS vehicle_name TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS package_name TEXT;
```

### 5️⃣ Klik "RUN" atau Tekan Ctrl+Enter

### 6️⃣ ✅ Selesai!

---

## 🎯 Kenapa Error Ini Terjadi?

Table `jobs` di database **tidak punya column untuk manual input**.

**Yang Dibutuhkan Admin Form:**
- ✍️ **Atas Nama** → Perlu column `customer_name`
- ✍️ **Nama Kendaraan** → Perlu column `vehicle_name`
- 📦 **Package Name** → Perlu column `package_name`

**Tapi column-column ini BELUM ADA!** Jadi harus ditambahkan dulu.

---

## 📊 Analogi:

Bayangkan form seperti ini:
```
┌─────────────────────────┐
│ Atas Nama: [_______]   │ ← Mau simpan ke mana?
│ Kendaraan: [_______]   │ ← Column belum ada!
└─────────────────────────┘
```

Setelah migration:
```
Database Table: jobs
┌──────────────┬──────────────┬──────────────┐
│ customer_name│ vehicle_name │ package_name │ ← Column baru!
├──────────────┼──────────────┼──────────────┤
│ Budi Santoso │ Honda Beat   │ Basic Tune-Up│
└──────────────┴──────────────┴──────────────┘
```

---

## ⏱️ Estimasi Waktu:

1. Buka dashboard: **30 detik**
2. Klik SQL Editor: **10 detik**
3. Paste & Run SQL: **20 detik**
4. Verify: **10 detik**

**TOTAL: 1-2 menit!** ⚡

---

## 🧪 Test Setelah Migration:

1. Refresh browser (F5)
2. Go to Admin Dashboard
3. Klik "Buat Job Baru"
4. Isi form:
   ```
   Atas Nama: Test User
   Kendaraan: Honda Beat
   Tanggal: Hari ini
   Waktu: 10:00
   ```
5. Klik "Buat Job Order"
6. ✅ **Harusnya SUKSES!**

---

## ❓ FAQ:

**Q: Aman gak migration ini?**  
A: ✅ Sangat aman! Cuma nambah column, tidak mengubah data existing.

**Q: Data lama hilang gak?**  
A: ❌ Tidak! Data existing tetap utuh.

**Q: Perlu restart server?**  
A: ❌ Tidak perlu! Langsung aktif setelah run SQL.

**Q: Kalo gagal gimana?**  
A: Cek error message di SQL Editor, atau hubungi saya dengan screenshot error.

**Q: Harus run berapa kali?**  
A: Cukup **SEKALI** saja! `IF NOT EXISTS` memastikan tidak error kalo run 2x.

---

## 🎉 Setelah Selesai:

✅ Admin bisa buat job manual  
✅ Input customer name  
✅ Input vehicle name  
✅ Tidak perlu registrasi user/vehicle  
✅ Perfect untuk walk-in customers!

---

## 📞 Need Help?

Kalau ada masalah, screenshot dan share:
1. ❌ Error message dari SQL Editor
2. 📸 Screenshot Supabase SQL Editor
3. 💬 Error dari browser console (F12)

---

**Copy SQL ini sekarang dan run di Supabase! 🚀**

```sql
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS vehicle_name TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS package_name TEXT;
```
