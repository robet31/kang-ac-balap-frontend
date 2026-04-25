# 🔄 REAL-TIME BOOKING FLOW
## Sunest Auto - Customer to Admin Real-Time Validation

---

## 📋 **OVERVIEW**

Sistem booking real-time yang menghubungkan customer dan admin dengan flow:
1. **Customer** booking → status `pending` → muncul pop-up "Menunggu Validasi"
2. **Admin** lihat pending bookings → klik "Setujui" atau "Tolak"
3. **Customer** tracking auto-update real-time → lihat status terbaru
4. **Stock warnings** hanya tampil di admin dashboard

---

## 🚀 **FLOW DIAGRAM**

```
CUSTOMER SIDE:
┌─────────────────┐
│ 1. Pilih Paket  │
│    Service      │
└────────┬────────┘
         │
         v
┌─────────────────┐
│ 2. Isi Form     │
│    Booking      │
└────────┬────────┘
         │
         v
┌─────────────────┐
│ 3. Review &     │
│    Konfirmasi   │
└────────┬────────┘
         │
         v
┌─────────────────┐
│ 4. POST /bookings│ ──────────┐
│    (Real-time)  │            │
└────────┬────────┘            │
         │                     │
         v                     │
┌─────────────────┐            │
│ 5. Pop-up:      │            │
│   "Menunggu     │            │
│    Validasi"    │            │
└─────────────────┘            │
                               │
ADMIN SIDE:                    │
                               v
┌──────────────────────────────┐
│ 1. Auto-refresh every 10s    │
│    Pending Bookings          │
└────────┬─────────────────────┘
         │
         v
┌─────────────────┐
│ 2. Admin Lihat  │
│    Booking      │
│    Details      │
└────────┬────────┘
         │
         ├──> Setujui ──┐
         │               │
         └──> Tolak ─────┤
                         │
                         v
              ┌──────────────────┐
              │ PUT /bookings/   │
              │     :id/status   │
              └────────┬─────────┘
                       │
CUSTOMER TRACKING:     │
                       v
┌─────────────────────────────┐
│ 1. Auto-refresh every 5s    │
│    GET /bookings/customer/  │
└────────┬────────────────────┘
         │
         v
┌─────────────────┐
│ 2. Status       │
│    Updated!     │
│    - scheduled  │
│    - cancelled  │
└─────────────────┘
```

---

## 📁 **NEW FILES CREATED**

### **1. `/components/admin/PendingBookings.tsx`** ✅
**Admin Dashboard Component**
- Real-time list of pending bookings
- Auto-refresh every 10 seconds
- Approve/Reject buttons
- Show customer info, items, schedule
- Stock warnings for admin only

**Key Features:**
```javascript
// Auto-refresh
useEffect(() => {
  const interval = setInterval(fetchPendingBookings, 10000);
  return () => clearInterval(interval);
}, []);

// Approve booking
PUT /bookings/:id/status
{
  status: 'scheduled',
  notes: 'Booking disetujui oleh admin'
}

// Reject booking
PUT /bookings/:id/status
{
  status: 'cancelled',
  notes: 'Booking ditolak oleh admin'
}
```

### **2. `/components/dashboard/TrackingTab.tsx`** ✅
**Customer Tracking Component**
- Real-time booking status tracking
- Auto-refresh every 5 seconds
- Visual timeline progress
- Show booking details & items
- Payment status indicator

**Key Features:**
```javascript
// Auto-refresh
useEffect(() => {
  const interval = setInterval(fetchCustomerBookings, 5000);
  return () => clearInterval(interval);
}, []);

// Visual status timeline
pending → scheduled → in_progress → completed
```

### **3. Updated `/components/dashboard/BookingTab.tsx`** ✅
**Customer Booking Component**
- Added waiting modal after booking
- Shows "Menunggu Validasi Admin"
- Removed stock warnings (admin only)
- Real-time database integration

**Key Changes:**
```javascript
// Modal state
const [showWaitingModal, setShowWaitingModal] = useState(false);
const [latestJobNumber, setLatestJobNumber] = useState('');
const [bookingStatus, setBookingStatus] = useState('pending');

// Show after booking success
setShowWaitingModal(true);
setLatestJobNumber(jobNumber);
setBookingStatus('pending');
```

---

## 🎯 **USAGE FLOW**

### **Customer Side:**

#### **Step 1: Create Booking**
```javascript
// BookingTab.tsx
POST /bookings
{
  customer_id: "uuid",
  service_id: "00000000-0000-0000-0000-000000000001",
  vehicle_id: "uuid",
  scheduled_date: "2026-02-04 09:00:00",
  labor_cost: 100000,
  items: [
    { sku: "OLI-FED-08L", qty: 1 }
  ]
}
```

#### **Step 2: See Waiting Modal**
```
┌────────────────────────────┐
│ Menunggu Validasi Admin    │
├────────────────────────────┤
│ [⏳] Menunggu validasi admin│
│                             │
│ Job Number: JO-2026-123456  │
│                             │
│      [Tutup]                │
└────────────────────────────┘
```

#### **Step 3: Check Tracking**
```javascript
// TrackingTab.tsx
GET /bookings/customer/:customerId

// Response:
{
  status: "pending", // or "scheduled", "in_progress", etc
  job_number: "JO-2026-123456",
  total_amount: 185000,
  ...
}
```

---

### **Admin Side:**

#### **Step 1: View Pending Bookings**
```javascript
// PendingBookings.tsx
GET /bookings
// Filter: status === 'pending'

// Auto-refresh every 10s
setInterval(fetchPendingBookings, 10000);
```

#### **Step 2: Approve or Reject**
```javascript
// Approve
PUT /bookings/:id/status
{
  status: 'scheduled',
  notes: 'Booking disetujui oleh admin'
}

// Reject
PUT /bookings/:id/status
{
  status: 'cancelled',
  notes: 'Booking ditolak oleh admin'
}
```

#### **Step 3: Stock Warnings (Admin Only)**
```
⚠️ Stock Warnings:
- Oli Mesin Federal: 5 tersisa (min: 50)
- Filter Oli Honda: Stock akan habis
```

---

## 🔄 **REAL-TIME UPDATES**

### **Customer Tracking Auto-Refresh:**
```javascript
// Update every 5 seconds
useEffect(() => {
  if (user?.id) {
    fetchCustomerBookings();
    const interval = setInterval(fetchCustomerBookings, 5000);
    return () => clearInterval(interval);
  }
}, [user]);
```

### **Admin Pending Bookings Auto-Refresh:**
```javascript
// Update every 10 seconds
useEffect(() => {
  fetchPendingBookings();
  const interval = setInterval(fetchPendingBookings, 10000);
  return () => clearInterval(interval);
}, []);
```

---

## 📊 **STATUS FLOW**

```
Customer Books → [pending]
                     │
                     ├─> Admin Approve → [scheduled]
                     │                       │
                     │                       ├─> Technician Start → [in_progress]
                     │                       │                         │
                     │                       │                         ├─> Complete → [awaiting_payment]
                     │                       │                         │                  │
                     │                       │                         │                  └─> Pay → [completed]
                     │                       │                         │
                     │                       │                         └─> Cancel → [cancelled]
                     │
                     └─> Admin Reject → [cancelled]
```

---

## 🎨 **UI COMPONENTS**

### **Customer Waiting Modal:**
```jsx
<Modal>
  <Icon>
    {status === 'pending' && <Loader2 className="animate-spin" />}
    {status === 'scheduled' && <CheckCircle2 />}
    {status === 'rejected' && <AlertTriangle />}
  </Icon>
  <Text>
    {status === 'pending' && 'Menunggu validasi admin'}
    {status === 'scheduled' && 'Booking disetujui'}
    {status === 'rejected' && 'Booking ditolak'}
  </Text>
  <JobNumber>JO-2026-123456</JobNumber>
</Modal>
```

### **Customer Tracking Timeline:**
```jsx
<Timeline>
  <Step active={status >= 'pending'}>
    <Clock /> Pending
  </Step>
  <Step active={status >= 'scheduled'}>
    <Calendar /> Scheduled
  </Step>
  <Step active={status >= 'in_progress'}>
    <Wrench /> In Progress
  </Step>
  <Step active={status === 'completed'}>
    <CheckCircle2 /> Completed
  </Step>
</Timeline>
```

### **Admin Pending Card:**
```jsx
<Card border="orange">
  <Badge>🕐 Pending</Badge>
  <JobNumber>JO-2026-123456</JobNumber>
  <Customer>{full_name}</Customer>
  <Service>{service_name}</Service>
  <Items>
    {job_parts.map(part => ...)}
  </Items>
  <Actions>
    <Button variant="reject">❌ Tolak</Button>
    <Button variant="approve">✅ Setujui</Button>
  </Actions>
</Card>
```

---

## ⚡ **KEY FEATURES**

### **✅ Real-Time Updates**
- Customer tracking auto-refresh every 5s
- Admin pending list auto-refresh every 10s
- No manual refresh needed

### **✅ Visual Feedback**
- Waiting modal after booking
- Timeline progress indicator
- Status badges with colors
- Loading animations

### **✅ Admin Control**
- One-click approve/reject
- View all booking details
- Stock warnings visible
- Customer notes displayed

### **✅ Customer Experience**
- Clear booking confirmation
- Real-time status tracking
- Visual progress timeline
- No stock warnings (clean UI)

---

## 🔧 **INTEGRATION POINTS**

### **Customer Dashboard:**
```javascript
import { BookingTab } from '../components/dashboard/BookingTab';
import { TrackingTab } from '../components/dashboard/TrackingTab';

// Add to navigation
<Tab>Booking</Tab>
<Tab>Tracking</Tab>
```

### **Admin Dashboard:**
```javascript
import { PendingBookings } from '../components/admin/PendingBookings';

// Add to admin view
<Section>
  <PendingBookings />
</Section>
```

---

## 📱 **NOTIFICATIONS**

### **Customer Notifications:**
```javascript
// After booking
toast.success(`🎉 Booking berhasil dibuat! (${jobNumber})`);
toast.success('✅ Data tersimpan ke database real-time!');
toast.success('📋 Menunggu validasi admin');

// After admin approval (in tracking)
// Shows automatically via status change
```

### **Admin Notifications:**
```javascript
// After approve
toast.success(`✅ Booking ${jobNumber} disetujui!`);
toast.success('📱 Customer akan menerima notifikasi');

// After reject
toast.success(`✅ Booking ${jobNumber} ditolak`);
toast.success('📱 Customer akan menerima notifikasi');
```

---

## 🎊 **SUMMARY**

### **What's New:**
1. ✅ **PendingBookings** component for admin
2. ✅ **TrackingTab** component for customer
3. ✅ **Waiting Modal** in BookingTab
4. ✅ **Real-time auto-refresh** (5s customer, 10s admin)
5. ✅ **Stock warnings** removed from customer view
6. ✅ **Visual timeline** for tracking
7. ✅ **One-click approve/reject** for admin

### **Benefits:**
- 🚀 **Instant feedback** for customers
- ⚡ **Real-time updates** without manual refresh
- 🎯 **Clear validation flow** for admins
- 🧹 **Clean customer UI** (no stock warnings)
- 📊 **Visual progress tracking**
- 🔄 **Automated polling** for updates

---

**Last Updated:** February 3, 2026  
**Sunest Auto Platform** - Real-Time Booking Management System
