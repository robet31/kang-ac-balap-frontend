# 📊 Penjelasan Dashboard - Sunest Auto

## 1. 📈 **Weekly Revenue Chart**

### **Apa itu Weekly Revenue?**
Chart ini menampilkan **pendapatan per minggu** dari **bulan berjalan saja** (bukan keseluruhan tahun).

### **Cara Kerja:**
- ✅ **Real-time**: Otomatis update saat ada job dengan status `completed`
- ✅ **Data Source**: Menghitung total `amount` dari semua job completed, dikelompokkan per minggu
- ✅ **Horizontal Bars**: Chart tidur ke samping (kiri ke kanan)

### **Dummy Data (Jika Belum Ada Job):**
```javascript
Week 1 (1-7):   Rp 3.500.000
Week 2 (8-14):  Rp 4.200.000
Week 3 (15-21): Rp 5.100.000
Week 4 (22-28): Rp 2.800.000
```

### **Kapan Data Real Muncul?**
Saat ada job dengan status `completed` di bulan berjalan, data dummy otomatis diganti dengan data real.

### **Format Tampilan:**
```
[Bar Chart Horizontal]
Week 1 (1-7)   |████████████████████| Rp 3,5M
Week 2 (8-14)  |█████████████████████████| Rp 4,2M
Week 3 (15-21) |████████████████████████████████| Rp 5,1M
Week 4 (22-28) |███████████████| Rp 2,8M
```

---

## 2. 🔧 **Top 5 Spareparts**

### **Apa itu Top 5 Spareparts?**
Menampilkan **5 sparepart paling menguntungkan** berdasarkan **total revenue** dari semua job yang menggunakan sparepart tersebut.

### **Penjelasan Angka:**

#### **"Rp 2.25M" (Total Revenue)**
- ✅ **Artinya**: Total uang yang dihasilkan dari penjualan sparepart ini di **semua job**
- ✅ **Cara Hitung**: `price × quantity` untuk setiap kali sparepart digunakan, lalu dijumlahkan
- ✅ **Label**: "Total Revenue"

**Contoh Perhitungan:**
```javascript
Oli Castrol 10W-40:
- Job #1: 1 liter × Rp 50.000 = Rp 50.000
- Job #2: 2 liter × Rp 50.000 = Rp 100.000
- Job #3: 1 liter × Rp 50.000 = Rp 50.000
... (41 job lainnya)
----------------------------------------------
Total: 45 job × rata-rata Rp 50.000 = Rp 2.250.000
```

#### **"45x" (Frequency Count)**
- ✅ **Artinya**: Sparepart ini digunakan di **45 job berbeda**
- ✅ **Cara Hitung**: Menghitung berapa kali sparepart muncul di array `spareparts` dari semua job
- ✅ **Label**: "Digunakan 45x dalam berbagai job"

**Contoh:**
```javascript
Oli Castrol digunakan di:
- Job #001 ✅
- Job #003 ✅
- Job #007 ✅
... (total 45 job)
```

---

## 3. 📊 **Tampilan Visual Top 5 Spareparts**

### **Format Card:**
```
╔═══════════════════════════════════════════════════╗
║ 1. Oli Mesin Castrol 10W-40                      ║
║    Digunakan 45x dalam berbagai job              ║
║                                        Rp 2.25M  ║
║                                   Total Revenue  ║
║    [████████████████████████████████] 100%       ║
╠═══════════════════════════════════════════════════╣
║ 2. Brake Pad Brembo Front                        ║
║    Digunakan 28x dalam berbagai job              ║
║                                        Rp 2.80M  ║
║                                   Total Revenue  ║
║    [█████████████████████████████] 88%           ║
╠═══════════════════════════════════════════════════╣
║ 3. Ban Michelin Pilot Street 90/80              ║
║    Digunakan 15x dalam berbagai job              ║
║                                        Rp 2.40M  ║
║                                   Total Revenue  ║
║    [████████████████████████] 75%                ║
╚═══════════════════════════════════════════════════╝
```

### **Keterangan:**
- **Nama Sparepart**: Di kiri atas (bold)
- **"Digunakan Xx dalam berbagai job"**: Penjelasan frekuensi (text kecil, gray)
- **"Rp X.XXM"**: Total revenue dalam jutaan (bold, merah, di kanan)
- **"Total Revenue"**: Label penjelasan (text kecil, gray, di bawah revenue)
- **Progress Bar**: Persentase relatif terhadap sparepart #1 (gradient merah)
- **"XX%"**: Persentase dalam progress bar (putih, bold)

---

## 4. 🔄 **Real-time Update Behavior**

### **Skenario 1: Job Completed**
```
1. Admin/Customer menyelesaikan job → Status = "completed"
2. Supabase trigger real-time event
3. Hook useDashboardStats() fetch ulang data
4. Weekly Revenue & Top Spareparts recalculate
5. Chart otomatis update tanpa refresh halaman
```

### **Skenario 2: Job dengan Sparepart**
```
Job #123 completed:
- Service Fee: Rp 25.000
- Spareparts:
  • Oli Castrol 1L × Rp 50.000 = Rp 50.000
  • Filter Oli × Rp 30.000 = Rp 30.000
----------------------------------------------
Total Job: Rp 105.000

Update Dashboard:
✅ Weekly Revenue +Rp 105.000
✅ Top Spareparts:
   - Oli Castrol: count +1, revenue +Rp 50.000
   - Filter Oli: count +1, revenue +Rp 30.000
```

---

## 5. 🎨 **UI/UX Improvements**

### **Before (Sebelum Update):**
- ❌ "Rp 2.25M" → Tidak jelas artinya apa
- ❌ "45x" → Tidak ada penjelasan
- ❌ Weekly Revenue kosong tanpa dummy data

### **After (Setelah Update):**
- ✅ "Rp 2.25M" + label "Total Revenue"
- ✅ "Digunakan 45x dalam berbagai job" (penjelasan lengkap)
- ✅ Weekly Revenue selalu tampil (dummy data jika kosong)
- ✅ Progress bar dengan % yang jelas
- ✅ Console log untuk debugging

---

## 6. 🐛 **Troubleshooting**

### **Weekly Revenue Tidak Muncul?**
1. Buka browser console (F12)
2. Cari log: `📊 Weekly Revenue Data:`
3. Periksa `hasRealData` dan `data` array
4. Pastikan ada job dengan status `completed` di bulan berjalan

### **Top Spareparts Kosong?**
1. Cek console log: `✅ Dashboard stats updated:`
2. Lihat `topSpareparts: X` (harusnya 5 jika ada dummy data)
3. Pastikan job memiliki array `spareparts` yang tidak kosong

### **Data Tidak Real-time?**
1. Cek console: `📡 Dashboard stats subscription status:`
2. Pastikan status = `SUBSCRIBED`
3. Test: Buat job baru → Status completed → Dashboard harus auto-update

---

## 7. 📝 **Data Structure**

### **Weekly Revenue:**
```typescript
weeklyRevenueData: Array<{
  week: string;      // "Week 1 (1-7)"
  revenue: number;   // 3500000
}>
```

### **Top Spareparts:**
```typescript
topSpareparts: Array<{
  name: string;      // "Oli Mesin Castrol 10W-40"
  count: number;     // 45 (frekuensi penggunaan)
  revenue: number;   // 2250000 (total revenue)
}>
```

---

## 8. 🚀 **Next Steps**

✅ Dashboard sudah real-time
✅ Dummy data sudah ditambahkan
✅ UI sudah lebih jelas dengan label
✅ Console log untuk debugging

**Sekarang:**
- Coba buat job baru dengan sparepart
- Set status ke `completed`
- Dashboard otomatis update! 🎉
