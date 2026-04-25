# 🚀 REAL-TIME BOOKING FLOW - Implementation Guide

---

## 📋 **FITUR:**

### ✅ **Real-Time Flow:**
1. **Customer** booking → Status "pending"
2. **Admin** melihat booking baru real-time di dashboard
3. **Admin** approve → Status "scheduled"
4. **Customer** tracking tab auto-update real-time
5. **Pop-up** menunggu validasi admin
6. **Stock alert** HANYA di Admin Dashboard

---

## 🎯 **IMPLEMENTASI:**

### **STEP 1: Run Dummy Data SQL** (1 menit)

**File:** `/DUMMY_DATA_REALTIME.sql`

**What it creates:**
- ✅ 3 Vehicles (Honda Beat, Yamaha NMAX, Suzuki Satria)
- ✅ 10 Jobs/Bookings:
  - 3 **Pending** (waiting admin approval)
  - 2 **Scheduled** (approved by admin)
  - 2 **In Progress** (currently being serviced)
  - 1 **Awaiting Payment** (done, waiting payment)
  - 2 **Completed** (fully finished)

**How to run:**
1. Open: https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/sql
2. New query
3. Copy entire `/DUMMY_DATA_REALTIME.sql`
4. Run
5. Check output - should see "🎉 10 dummy bookings created successfully!"

---

### **STEP 2: Enable Real-Time in Supabase** (30 seconds)

**Enable real-time for `jobs` table:**

1. Go to: https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr/database/replication
2. Find table: `jobs`
3. Toggle **ON** for real-time replication
4. Click **Save**

---

### **STEP 3: Files Created** ✅

#### **1. Real-Time Hook:**
**File:** `/hooks/useRealtimeJobs.ts`

**Features:**
- ✅ Fetches jobs from database
- ✅ Real-time subscription for INSERT/UPDATE/DELETE
- ✅ Filters by user_id and status
- ✅ Auto-refresh on changes
- ✅ Console logging for debugging

**Usage:**
```typescript
import { useRealtimeJobs } from '../hooks/useRealtimeJobs';

// In component:
const { jobs, loading, error, refetch } = useRealtimeJobs({
  userId: user?.id, // Optional filter
  status: 'pending', // Optional filter
  autoRefresh: true // Enable real-time
});
```

---

#### **2. Dummy Data SQL:**
**File:** `/DUMMY_DATA_REALTIME.sql`

**Creates:**
- Vehicles for testing
- 10 jobs with various statuses
- Verification queries

---

#### **3. This Guide:**
**File:** `/REALTIME_BOOKING_GUIDE.md`

---

### **STEP 4: Update Components** (Already done in BookingTab)

#### **BookingTab** Already Has:
- ✅ Waiting modal after booking
- ✅ Shows job number
- ✅ Loading state
- ✅ Close button

**Need to add:**
- ✅ Real-time listener for status changes
- ✅ "Go to Tracking" button when approved
- ✅ Auto-close when approved

---

## 🔄 **BOOKING FLOW:**

### **Customer Side:**

```
1. User fills booking form
   ↓
2. Clicks "Konfirmasi Booking"
   ↓
3. Creates job in database (status: "pending")
   ↓
4. Shows success toast
   ↓
5. Opens "Menunggu Validasi Admin" modal
   ↓
6. Modal shows:
   - Loading spinner
   - Job number
   - "Menunggu validasi admin" message
   ↓
7. Real-time listener waits for status change
   ↓
8. When admin approves (status → "scheduled"):
   - Modal updates: ✅ "Booking disetujui!"
   - Shows "Lihat di Tracking" button
   - Tracking tab auto-updates
   ↓
9. User clicks "Lihat di Tracking"
   - Navigates to Tracking tab
   - Sees approved booking
```

---

### **Admin Side:**

```
1. Admin Dashboard auto-refreshes every 5 seconds
   ↓
2. New pending bookings appear instantly (real-time)
   ↓
3. Shows in "Pending Bookings" section:
   - Job number
   - Customer name
   - Service type
   - Amount
   - "Approve" button
   ↓
4. Admin clicks "Approve"
   ↓
5. Updates job status to "scheduled"
   ↓
6. Real-time update propagates to:
   - Customer modal (changes to "approved")
   - Customer tracking tab (booking appears)
   - Admin dashboard (moves to scheduled)
```

---

## 🎨 **UI/UX ENHANCEMENTS:**

### **Customer Booking Modal States:**

#### **State 1: Pending (Waiting)**
```
┌─────────────────────────────────┐
│ 🕐 Menunggu Validasi Admin      │
│                                 │
│ ⏳ Menunggu validasi admin      │
│    Job Number: JO-2024-001      │
│                                 │
│ [Tutup]                         │
└─────────────────────────────────┘
```

#### **State 2: Approved**
```
┌─────────────────────────────────┐
│ ✅ Booking Disetujui!           │
│                                 │
│ ✅ Booking disetujui            │
│    Job Number: JO-2024-001      │
│                                 │
│ [Tutup] [Lihat di Tracking] →  │
└─────────────────────────────────┘
```

#### **State 3: Rejected (Future)**
```
┌─────────────────────────────────┐
│ ⚠️ Booking Ditolak              │
│                                 │
│ ❌ Booking ditolak              │
│    Job Number: JO-2024-001      │
│    Alasan: Slot penuh           │
│                                 │
│ [Tutup] [Booking Ulang]         │
└─────────────────────────────────┘
```

---

### **Admin Pending Bookings Card:**

```
┌──────────────────────────────────────────┐
│ ⚠️ 3 Booking Baru Menunggu       [Urgent]│
│                                          │
│ Segera assign teknisi untuk melanjutkan │
│                                          │
│ ┌────────────────────────────────────┐  │
│ │ 🔧 JO-2024-001                     │  │
│ │    [Menunggu Assignment]           │  │
│ │    Rp 250K                         │  │
│ │    • Service Rutin                 │  │
│ │    • Honda Beat (B 1234 XYZ)       │  │
│ │    • 📅 5 menit yang lalu          │  │
│ │    [Approve] [Reject]              │  │
│ └────────────────────────────────────┘  │
│                                          │
│ (...2 more pending bookings)             │
└──────────────────────────────────────────┘
```

---

## 📊 **DATABASE SCHEMA:**

### **jobs Table:**
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  vehicle_id UUID REFERENCES vehicles(id),
  job_number TEXT UNIQUE NOT NULL,
  service_type TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN (
    'pending',
    'scheduled',
    'in_progress',
    'awaiting_payment',
    'completed',
    'cancelled'
  )),
  scheduled_date TIMESTAMP,
  completed_date TIMESTAMP,
  amount DECIMAL(10,2) NOT NULL,
  progress INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Customers can see their own jobs
CREATE POLICY "Customers can view own jobs"
  ON jobs FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can see all jobs
CREATE POLICY "Admins can view all jobs"
  ON jobs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can update all jobs
CREATE POLICY "Admins can update all jobs"
  ON jobs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

---

## 🔔 **REAL-TIME SUBSCRIPTION:**

### **Setup:**

```typescript
// In useRealtimeJobs hook
const supabase = createClient();

const channel = supabase
  .channel('jobs-realtime')
  .on(
    'postgres_changes',
    {
      event: '*', // Listen to INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'jobs',
      filter: userId ? `user_id=eq.${userId}` : undefined,
    },
    (payload) => {
      console.log('🔔 Real-time update:', payload);
      
      if (payload.eventType === 'INSERT') {
        // New job created
        setJobs((prev) => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        // Job updated
        setJobs((prev) =>
          prev.map((job) =>
            job.id === payload.new.id ? payload.new : job
          )
        );
      } else if (payload.eventType === 'DELETE') {
        // Job deleted
        setJobs((prev) => prev.filter((job) => job.id !== payload.old.id));
      }
    }
  )
  .subscribe();
```

---

## 🧪 **TESTING SCENARIO:**

### **Test 1: New Booking Real-Time**

**Customer Side:**
1. Login as customer@demo.com
2. Go to Booking tab
3. Create new booking
4. See "Menunggu Validasi Admin" modal
5. Keep modal open

**Admin Side:**
1. Open another browser/incognito
2. Login as admin@demo.com
3. See new booking appear real-time (no refresh needed!)
4. Click "Approve"

**Customer Side (original window):**
5. Modal should auto-update to "Booking disetujui!" ✅
6. Click "Lihat di Tracking"
7. See approved booking in Tracking tab ✅

---

### **Test 2: Multiple Pending Bookings**

**Setup:**
1. Run `/DUMMY_DATA_REALTIME.sql` (creates 3 pending bookings)
2. Login as admin@demo.com
3. See all 3 bookings in "Pending Bookings" section
4. Approve one by one
5. Watch them move to scheduled section real-time

---

### **Test 3: Stock Alert (Admin Only)**

**Admin Side:**
1. Login as admin@demo.com
2. Go to Inventory tab
3. Create items with low stock (e.g., quantity < 10)
4. See "Stock Alert" notification in dashboard
5. Shows "5 Items" low stock

**Customer Side:**
1. Login as customer@demo.com
2. Go to Dashboard or any tab
3. ✅ **Should NOT see any stock alerts**
4. Stock management is admin-only feature

---

## 📝 **CONSOLE LOGS (For Debugging):**

### **Expected Customer Logs:**

```
// After booking submission:
✅ Booking created: JO-2024-001
🔌 Setting up real-time subscription for jobs...
📡 Real-time subscription status: SUBSCRIBED

// When admin approves:
🔔 Real-time update received: {eventType: "UPDATE", ...}
✏️ Job updated: {id: "...", status: "scheduled", ...}
✅ Booking status changed to: scheduled
```

---

### **Expected Admin Logs:**

```
// On dashboard load:
✅ Jobs fetched: 10 jobs
🔌 Setting up real-time subscription for jobs...
📡 Real-time subscription status: SUBSCRIBED

// When customer creates booking:
🔔 Real-time update received: {eventType: "INSERT", ...}
➕ New job created: {id: "...", status: "pending", ...}
✅ New pending booking: JO-2024-001
```

---

## 🎯 **CHECKLIST:**

### **Setup:**
- [ ] Run `/DUMMY_DATA_REALTIME.sql` in Supabase SQL Editor
- [ ] Enable real-time replication for `jobs` table
- [ ] Verify 10 dummy bookings created

### **Customer Features:**
- [ ] Booking creates job with "pending" status
- [ ] Shows "Menunggu Validasi Admin" modal
- [ ] Modal displays job number
- [ ] Real-time listener active (check console)
- [ ] Modal updates when admin approves
- [ ] "Lihat di Tracking" button appears when approved
- [ ] Clicking button navigates to Tracking tab
- [ ] Tracking tab shows approved booking
- [ ] NO stock alerts visible

### **Admin Features:**
- [ ] Pending bookings appear real-time
- [ ] Shows booking details (job number, service, amount)
- [ ] "Approve" button works
- [ ] Approving updates status to "scheduled"
- [ ] Real-time update propagates to customer
- [ ] Stock alerts ONLY visible in admin dashboard
- [ ] Dashboard auto-refreshes every 5 seconds

---

## 🚀 **NEXT STEPS TO IMPLEMENT:**

### **1. Update BookingTab Modal:** (Priority)

Add real-time listener for job status changes in modal:

```typescript
// In BookingTab component
useEffect(() => {
  if (!showWaitingModal || !latestJobNumber) return;
  
  const supabase = createClient();
  
  const channel = supabase
    .channel(`job-status-${latestJobNumber}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'jobs',
        filter: `job_number=eq.${latestJobNumber}`,
      },
      (payload) => {
        const newStatus = payload.new.status;
        console.log('🔔 Job status updated:', newStatus);
        
        if (newStatus === 'scheduled') {
          setBookingStatus('scheduled');
          toast.success('✅ Booking disetujui admin!');
        } else if (newStatus === 'cancelled') {
          setBookingStatus('rejected');
          toast.error('❌ Booking ditolak admin');
        }
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
}, [showWaitingModal, latestJobNumber]);
```

---

### **2. Add "Go to Tracking" Button:**

```typescript
// In modal JSX
<div className="flex gap-3">
  <Button
    variant="outline"
    onClick={() => setShowWaitingModal(false)}
    className="flex-1"
  >
    Tutup
  </Button>
  
  {bookingStatus === 'scheduled' && (
    <Button
      onClick={() => {
        setShowWaitingModal(false);
        onNavigate('tracking'); // Navigate to tracking tab
      }}
      className="flex-1 bg-green-500 hover:bg-green-600"
    >
      Lihat di Tracking →
    </Button>
  )}
</div>
```

---

### **3. Update TrackingTab with Real-Time:**

Replace static fetch with `useRealtimeJobs` hook:

```typescript
// In TrackingTab component
import { useRealtimeJobs } from '../../hooks/useRealtimeJobs';

export function TrackingTab() {
  const { user } = useAuth();
  const { jobs, loading, error } = useRealtimeJobs({
    userId: user?.id,
    autoRefresh: true
  });
  
  // Rest of component...
}
```

---

### **4. Update AdminDashboard with Real-Time:**

```typescript
// In AdminDashboard component
import { useRealtimeJobs } from '../hooks/useRealtimeJobs';

export function AdminDashboard() {
  // All jobs with real-time updates
  const { jobs, loading } = useRealtimeJobs({
    autoRefresh: true
  });
  
  // Filter by status
  const pendingJobs = jobs.filter(j => j.status === 'pending');
  const scheduledJobs = jobs.filter(j => j.status === 'scheduled');
  const inProgressJobs = jobs.filter(j => j.status === 'in_progress');
  
  // Rest of component...
}
```

---

### **5. Add Approve Button in AdminDashboard:**

```typescript
const handleApproveBooking = async (jobId: string) => {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('jobs')
      .update({ 
        status: 'scheduled',
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
    
    if (error) throw error;
    
    toast.success('✅ Booking disetujui!');
    // Real-time will auto-update the UI
  } catch (error) {
    console.error('Error approving booking:', error);
    toast.error('❌ Gagal menyetujui booking');
  }
};
```

---

## 🎉 **RESULT:**

After implementation:

### ✅ **Customer Experience:**
1. Books service → Gets instant feedback
2. Sees "waiting for admin" modal
3. Modal auto-updates when approved
4. Navigates to tracking with one click
5. Tracking shows real-time updates
6. No stock alerts (admin-only feature)

### ✅ **Admin Experience:**
1. Sees new bookings instantly
2. No manual refresh needed
3. Approves with one click
4. Customer gets notified immediately
5. Stock alerts help manage inventory
6. Dashboard auto-refreshes

### ✅ **Technical:**
1. Full real-time synchronization
2. No polling needed
3. Efficient Supabase subscriptions
4. Console logs for debugging
5. Error handling
6. Proper state management

---

## 📚 **FILES SUMMARY:**

```
✅ /DUMMY_DATA_REALTIME.sql       - 10 dummy bookings
✅ /hooks/useRealtimeJobs.ts      - Real-time hook
✅ /REALTIME_BOOKING_GUIDE.md     - This guide

📝 Need to update:
- /components/dashboard/BookingTab.tsx    - Add real-time modal
- /components/dashboard/TrackingTab.tsx   - Use real-time hook
- /components/AdminDashboard.tsx          - Use real-time hook + approve button
```

---

**Time to implement:** 15-20 minutes  
**Testing time:** 5 minutes  
**Total:** ~25 minutes

**Ready to make it real-time! 🚀**
