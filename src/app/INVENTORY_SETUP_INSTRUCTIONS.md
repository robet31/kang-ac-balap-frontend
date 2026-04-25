# 📦 Instruksi Setup Inventory - Sunest Auto

## Masalah: Harga Sparepart Rp 0

Jika harga sparepart di dashboard customer masih menampilkan Rp 0, itu karena **data inventory belum di-seed ke KV Store**.

## Solusi: Seed Inventory Data

### Langkah 1: Buka Aplikasi
1. Jalankan aplikasi Sunest Auto
2. Akan muncul **Seed Inventory Button** di pojok kanan bawah layar

### Langkah 2: Seed Data
1. Klik button **Seed Inventory** untuk expand
2. Lihat preview data yang akan ditambahkan:
   - Oli Mesin SAE 10W-40 (Rp 75.000)
   - Oli Mesin Fully Synthetic (Rp 150.000)
   - Busi Iridium (Rp 45.000)
   - Filter Udara (Rp 35.000)
   - Filter Oli (Rp 25.000)
   - Kampas Rem Depan (Rp 120.000)
3. Klik tombol **"Seed Data Sekarang"**
4. Tunggu proses selesai (akan muncul notifikasi sukses)

### Langkah 3: Refresh & Test
1. Refresh halaman atau navigasi ke tab **Booking**
2. Pilih salah satu paket service
3. Harga sparepart seharusnya sudah muncul dengan benar
4. Cek juga di tab **Tracking** untuk melihat rincian harga yang benar

## Detail Teknis

### Data Structure
Inventory disimpan di KV Store dengan format:
- **Key**: `inventory_{SKU}` (contoh: `inventory_OLI-001`)
- **Value**: 
  ```json
  {
    "sku": "OLI-001",
    "name": "Oli Mesin SAE 10W-40",
    "category": "Pelumas",
    "unit": "liter",
    "price": 75000,
    "stock": 50,
    "minStock": 10,
    "createdAt": "2026-02-04T...",
    "updatedAt": "2026-02-04T..."
  }
  ```

### Endpoint
- **Fetch all inventory**: `GET /kv/prefix/inventory_`
- **Seed single item**: `POST /kv/set/inventory_{SKU}`

### Integrasi dengan Booking Flow
1. Ketika user memilih package, sistem fetch harga dari inventory berdasarkan SKU
2. Harga di-enrich ke item object: `item.price = inventoryItem?.price || 0`
3. Total dihitung: `itemTotal = item.price * item.qty`
4. Ditampilkan di UI dengan format Rupiah

## Troubleshooting

### Harga masih Rp 0 setelah seed?
1. **Refresh halaman** - Data mungkin sudah tersimpan tapi belum di-fetch ulang
2. **Cek console** - Lihat apakah ada error saat fetch inventory
3. **Seed ulang** - Klik tombol seed data sekali lagi untuk memastikan

### Button seed tidak muncul?
1. Pastikan Anda sudah melewati splash screen
2. Button ada di pojok kanan bawah, bisa di-minimize jika menghalangi

### Inventory tidak ter-fetch?
1. Cek network tab di browser DevTools
2. Pastikan endpoint KV Store berjalan dengan benar
3. Lihat response dari `GET /kv/prefix/inventory_`

## File-file Terkait

- `/components/SeedInventoryButton.tsx` - Komponen untuk seed data
- `/components/dashboard/BookingTab.tsx` - Booking flow dengan pricing
- `/components/dashboard/TrackingTab.tsx` - Tracking dengan pricing detail
- `/supabase/functions/server/index.tsx` - KV Store endpoints

## Catatan Penting

⚠️ **HANYA PERLU DI-SEED SEKALI** - Setelah berhasil seed, data akan permanen di KV Store dan tidak perlu seed ulang kecuali ingin update harga atau tambah item baru.

✅ **Harga akan otomatis muncul** di semua tempat:
- Booking Tab (saat pilih paket)
- Tracking Tab (detail service)
- Admin Dashboard (job orders detail)
