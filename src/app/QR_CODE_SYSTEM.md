# 🔐 QR Code Check-in System - Sunest Auto

Sistem QR Code otomatis untuk check-in booking customer.

---

## 📋 Overview

Setiap customer yang melakukan booking akan **otomatis** mendapatkan:
- ✅ QR Code unik
- ✅ Credential token (kode alfanumerik)
- ✅ Tersimpan di database
- ✅ Auto-delete saat booking selesai

---

## 🎯 Cara Kerja

### 1. **Customer Booking**
```
User membuat booking
    ↓
Generate QR Code token
    ↓
Simpan token di database (field: qr_code_token)
    ↓
Display QR Code di UI
```

### 2. **Customer Check-in**
```
Customer datang ke workshop
    ↓
Tunjukkan QR Code ke admin
    ↓
Admin scan dengan QR scanner/manual input
    ↓
System validasi token
    ↓
Update status booking → "checked_in"
```

### 3. **Auto-cleanup**
```
Booking selesai (status: completed)
    ↓
QR Code token dihapus dari database
    ↓
Hemat storage
```

---

## 🔧 Technical Implementation

### A. QR Code Token Format

```
SUNEST-YYYYMMDD-XXXX

Contoh:
SUNEST-20260207-A1B2
SUNEST-20260208-K9P3

- SUNEST: Prefix tetap
- YYYYMMDD: Tanggal generate (20260207)
- XXXX: Random 4 karakter (A-Z, 0-9)
```

### B. Database Schema

```typescript
// Field di table job_orders/bookings:
qr_code_token: string | null

Example:
{
  id: 1,
  job_number: "JOB-2026-001",
  customer_id: "user_001",
  qr_code_token: "SUNEST-20260207-A1B2",  // ← QR Code
  status: "pending",
  ...
}
```

### C. API Endpoints

**1. Generate QR Code (Auto saat booking dibuat)**
```typescript
POST /bookings
Body: {
  customer_id: "user_001",
  vehicle_id: "vehicle_001",
  service_type: "Oil Change",
  scheduled_date: "2026-02-10",
  ...
}

Response: {
  success: true,
  booking: {
    id: 1,
    job_number: "JOB-2026-001",
    qr_code_token: "SUNEST-20260207-A1B2",  // ← Generated
    ...
  }
}
```

**2. Validate QR Code (Admin scan)**
```typescript
POST /qr/validate
Body: {
  token: "SUNEST-20260207-A1B2"
}

Response: {
  valid: true,
  booking: {
    job_number: "JOB-2026-001",
    customer_name: "Budi Santoso",
    vehicle: "Yamaha NMAX",
    scheduled_date: "2026-02-10",
    ...
  }
}
```

**3. Check-in via QR (Admin action)**
```typescript
POST /bookings/:id/checkin
Body: {
  qr_token: "SUNEST-20260207-A1B2"
}

Response: {
  success: true,
  message: "Customer berhasil check-in",
  booking: {
    status: "checked_in",  // ← Status updated
    ...
  }
}
```

**4. Delete QR Code (Auto saat completed)**
```typescript
// Otomatis dipanggil saat:
PUT /bookings/:id/status
Body: {
  status: "completed"
}

// Backend logic:
if (status === 'completed') {
  // Remove QR code token
  qr_code_token = null;
}
```

---

## 💻 Frontend Implementation

### 1. Display QR Code (Customer UI)

```tsx
// components/dashboard/PendingBookings.tsx

{booking.qr_code_token && (
  <div className="qr-code-section">
    {/* QR Code Image */}
    <img 
      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(booking.qr_code_token)}`}
      alt="QR Code Check-in"
    />
    
    {/* Credential Token */}
    <p className="credential-code">{booking.qr_code_token}</p>
  </div>
)}
```

### 2. QR Scanner (Admin UI)

```tsx
// pages/admin/qr-scanner.tsx

import { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function QRScanner() {
  const [scannedToken, setScannedToken] = useState('');
  
  const handleScan = async (token: string) => {
    // Validate & check-in
    const response = await fetch('/api/qr/validate', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
    
    if (response.ok) {
      // Show booking details
      // Allow admin to confirm check-in
    }
  };
  
  return (
    <div>
      <QRCodeScanner onScan={handleScan} />
      
      {/* Manual Input Fallback */}
      <input 
        placeholder="Atau ketik kode manual"
        onChange={(e) => setScannedToken(e.target.value)}
      />
    </div>
  );
}
```

---

## 🗄️ Backend Logic

### 1. Generate QR on Booking Creation

```typescript
// supabase/functions/server/routes/bookings.ts

import { generateQRCodeToken } from '../../../utils/qr-code';

// POST /bookings
async function createBooking(req, res) {
  const { customer_id, vehicle_id, service_type, ... } = req.body;
  
  // Generate QR Code
  const qr_code_token = generateQRCodeToken();
  
  // Create booking with QR token
  const booking = await db.insert({
    customer_id,
    vehicle_id,
    service_type,
    qr_code_token,  // ← Save token
    status: 'pending',
    ...
  });
  
  return res.json({
    success: true,
    booking: {
      ...booking,
      qr_image_url: getQRCodeImageURL(qr_code_token)
    }
  });
}
```

### 2. Validate QR Code

```typescript
// POST /qr/validate
async function validateQRCode(req, res) {
  const { token } = req.body;
  
  // Validate format
  if (!validateQRCodeToken(token)) {
    return res.status(400).json({
      valid: false,
      error: 'Invalid QR code format'
    });
  }
  
  // Find booking by token
  const booking = await db.query(
    'SELECT * FROM job_orders WHERE qr_code_token = $1',
    [token]
  );
  
  if (!booking) {
    return res.status(404).json({
      valid: false,
      error: 'QR code not found or already used'
    });
  }
  
  return res.json({
    valid: true,
    booking: {
      job_number: booking.job_number,
      customer_name: booking.customer_name,
      vehicle: booking.vehicle_name,
      scheduled_date: booking.scheduled_date,
      status: booking.status
    }
  });
}
```

### 3. Check-in Customer

```typescript
// POST /bookings/:id/checkin
async function checkInBooking(req, res) {
  const { id } = req.params;
  const { qr_token } = req.body;
  
  // Verify QR token matches booking
  const booking = await db.findById(id);
  
  if (booking.qr_code_token !== qr_token) {
    return res.status(400).json({
      success: false,
      error: 'QR code does not match this booking'
    });
  }
  
  // Update status to checked_in
  await db.update(id, {
    status: 'checked_in',
    checked_in_at: new Date(),
    checked_in_by: req.admin_id
  });
  
  return res.json({
    success: true,
    message: 'Customer berhasil check-in'
  });
}
```

### 4. Auto-delete QR when Completed

```typescript
// PUT /bookings/:id/status
async function updateBookingStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  
  const updates: any = { status };
  
  // Auto-delete QR token when completed
  if (status === 'completed') {
    updates.qr_code_token = null;  // ← Delete token
    updates.qr_deleted_at = new Date();
  }
  
  await db.update(id, updates);
  
  return res.json({
    success: true,
    message: `Booking ${status}`,
    qr_deleted: status === 'completed'
  });
}
```

---

## 📱 User Experience

### Customer Side:

**1. Setelah Booking Berhasil:**
```
✅ Booking berhasil dibuat!
JOB-2026-001

📱 QR Code Anda:
[QR Code Image]

Kode: SUNEST-20260207-A1B2

💡 Screenshot atau simpan kode ini.
   Tunjukkan ke admin saat check-in.
```

**2. Di Dashboard - Pending Bookings:**
```
┌─────────────────────────────┐
│ JOB-2026-001 | Pending       │
├─────────────────────────────┤
│ 📅 Jadwal: Senin, 10 Feb    │
│                              │
│ 🔐 QR Code Check-In:        │
│ [QR Code Image 180x180]     │
│                              │
│ Kode: SUNEST-20260207-A1B2  │
│ 💡 Tunjukkan saat check-in  │
│                              │
│ 🏍️ Yamaha NMAX (B 1234 XYZ) │
└─────────────────────────────┘
```

### Admin Side:

**1. QR Scanner Page:**
```
┌─────────────────────────────┐
│ 📷 Scan QR Code             │
├─────────────────────────────┤
│                              │
│   [Camera View]             │
│                              │
│ Atau ketik kode manual:     │
│ [__________________] [✓]    │
└─────────────────────────────┘
```

**2. After Scan - Booking Details:**
```
✅ QR Code Valid!

Customer: Budi Santoso
Kendaraan: Yamaha NMAX (B 1234 XYZ)
Jadwal: Senin, 10 Feb 2026 | 09:00

[✓ Konfirmasi Check-in]
```

---

## 🔒 Security Features

### 1. **Unique Token per Booking**
- Setiap booking punya QR unik
- Tidak bisa dipakai ulang

### 2. **Token Validation**
- Format validation: `SUNEST-YYYYMMDD-XXXX`
- Database lookup untuk verify

### 3. **One-time Use**
- Setelah check-in, status berubah
- QR tidak bisa dipakai lagi untuk booking yang sama

### 4. **Auto-expiry**
- QR dihapus saat booking completed
- Mencegah penyalahgunaan

### 5. **Admin Only**
- Hanya admin yang bisa scan & validate
- Customer hanya bisa lihat QR sendiri

---

## 🎨 UI Design

### QR Code Section Design:

```css
/* Purple/Pink gradient theme */
.qr-section {
  background: linear-gradient(135deg, #f3e7ff 0%, #ffe0f0 100%);
  border: 2px solid #d8b4fe;
  border-radius: 12px;
  padding: 16px;
}

.qr-image {
  width: 180px;
  height: 180px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.credential-code {
  font-family: 'Monaco', 'Courier', monospace;
  font-size: 18px;
  font-weight: bold;
  color: #7c3aed;
  letter-spacing: 2px;
  background: #f3f4f6;
  padding: 12px;
  border-radius: 8px;
  border: 2px dashed #d8b4fe;
}
```

---

## 📊 Database Cleanup Strategy

### Option 1: On-demand (Current)
```typescript
// Dihapus langsung saat status = completed
if (status === 'completed') {
  qr_code_token = null;
}
```

### Option 2: Scheduled Job (Future)
```typescript
// Cron job setiap hari jam 00:00
async function cleanupOldQRCodes() {
  // Hapus QR dari booking yang sudah completed > 7 hari
  await db.execute(`
    UPDATE job_orders 
    SET qr_code_token = NULL 
    WHERE status = 'completed' 
    AND completed_at < NOW() - INTERVAL '7 days'
    AND qr_code_token IS NOT NULL
  `);
}
```

---

## 🧪 Testing

### Test Cases:

```typescript
// 1. Generate QR Code
test('should generate valid QR code on booking', async () => {
  const booking = await createBooking({ ... });
  expect(booking.qr_code_token).toMatch(/^SUNEST-\d{8}-[A-Z0-9]{4}$/);
});

// 2. Validate QR Code
test('should validate correct QR token', async () => {
  const result = await validateQR('SUNEST-20260207-A1B2');
  expect(result.valid).toBe(true);
});

// 3. Invalid QR Format
test('should reject invalid QR format', async () => {
  const result = await validateQR('INVALID-123');
  expect(result.valid).toBe(false);
});

// 4. QR Not Found
test('should return not found for non-existent QR', async () => {
  const result = await validateQR('SUNEST-20260207-ZZZZ');
  expect(result.valid).toBe(false);
  expect(result.error).toContain('not found');
});

// 5. Auto-delete on Completed
test('should delete QR when booking completed', async () => {
  await updateStatus(bookingId, 'completed');
  const booking = await getBooking(bookingId);
  expect(booking.qr_code_token).toBeNull();
});
```

---

## 📱 QR Code Scanner Libraries

### Recommended:

**1. html5-qrcode (Recommended)**
```bash
npm install html5-qrcode
```

```tsx
import { Html5QrcodeScanner } from 'html5-qrcode';

const scanner = new Html5QrcodeScanner(
  "qr-reader",
  { fps: 10, qrbox: 250 },
  false
);

scanner.render(onScanSuccess, onScanFailure);
```

**2. react-qr-reader**
```bash
npm install react-qr-reader
```

```tsx
import QrReader from 'react-qr-reader';

<QrReader
  onScan={handleScan}
  onError={handleError}
  style={{ width: '100%' }}
/>
```

**3. Manual Input Fallback**
```tsx
// Always provide manual input option
<input 
  placeholder="Ketik kode: SUNEST-20260207-A1B2"
  onChange={handleManualInput}
/>
```

---

## 🚀 Implementation Checklist

### Backend:
- [x] Create QR utility functions (`/utils/qr-code.ts`)
- [ ] Add `qr_code_token` field to database
- [ ] Generate QR on booking creation
- [ ] API endpoint: POST /qr/validate
- [ ] API endpoint: POST /bookings/:id/checkin
- [ ] Auto-delete QR on completed status

### Frontend - Customer:
- [x] Display QR Code in PendingBookings
- [x] Show credential token
- [ ] Add download/save QR button
- [ ] Show QR in booking confirmation email

### Frontend - Admin:
- [ ] Create QR Scanner page
- [ ] Manual input fallback
- [ ] Validate & check-in flow
- [ ] Show booking details after scan

### Testing:
- [ ] Unit tests for QR generation
- [ ] Integration tests for validation
- [ ] E2E tests for full flow

---

## 📞 Support

Jika ada pertanyaan tentang QR Code system:
- 📖 Baca dokumentasi ini
- 📧 Email: dev@sunest-auto.com
- 💬 Internal chat: #qr-code-system

---

**Version:** 1.0.0  
**Last Updated:** 7 Februari 2026  
**Author:** Sunest Auto Development Team
