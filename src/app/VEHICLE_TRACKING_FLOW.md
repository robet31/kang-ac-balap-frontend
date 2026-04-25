# 🚗 VEHICLE & TRACKING FLOW
## Sunest Auto - Vehicle Management & Service History

---

## 📋 **OVERVIEW**

Sistem baru yang mengintegrasikan:
1. **VehiclesTab** - Kelola kendaraan & lihat riwayat service per kendaraan
2. **TrackingTab** - Filter booking berdasarkan kategori status
3. **Real-time updates** - Semua data terhubung real-time

---

## 🎯 **NEW FEATURES**

### ✅ **1. Vehicles Management**
- Add kendaraan baru
- Lihat semua kendaraan customer
- Expand untuk lihat riwayat service
- Real-time fetch dari database

### ✅ **2. Service History per Vehicle**
- Riwayat service ditampilkan di halaman kendaraan
- Tidak perlu page History terpisah
- Auto-load saat expand vehicle card
- Show all booking details & items

### ✅ **3. Tracking dengan Kategori**
- Filter: Semua, Menunggu, Dijadwalkan, Sedang Diperbaiki, Selesai
- Count badge per kategori
- Auto-refresh every 5 seconds
- Visual timeline progress

---

## 🔄 **FLOW DIAGRAM**

```
CUSTOMER FLOW:
┌─────────────────────────────┐
│ 1. Dashboard Customer       │
└──────────┬──────────────────┘
           │
           ├──> VEHICLES TAB
           │    ┌─────────────────────────┐
           │    │ • Tambah Kendaraan      │
           │    │ • Lihat List Kendaraan  │
           │    │ • Expand → Riwayat      │
           │    └──────────┬──────────────┘
           │               │
           │               v
           │    ┌─────────────────────────┐
           │    │ Riwayat Service:        │
           │    │ - JO-2026-123456        │
           │    │ - Status: Selesai       │
           │    │ - Items: Oli, Filter    │
           │    │ - Total: Rp 185,000     │
           │    └─────────────────────────┘
           │
           ├──> TRACKING TAB
           │    ┌─────────────────────────┐
           │    │ Filter Kategori:        │
           │    │ [Semua] [Menunggu]      │
           │    │ [Dijadwalkan] [Selesai] │
           │    └──────────┬──────────────┘
           │               │
           │               v
           │    ┌─────────────────────────┐
           │    │ Auto-refresh 5s         │
           │    │ Show filtered bookings  │
           │    │ Visual timeline         │
           │    └─────────────────────────┘
           │
           └──> BOOKING TAB
                (existing flow)
```

---

## 📁 **NEW FILES & UPDATES**

### **Created:**
1. ✅ `/components/dashboard/VehiclesTab.tsx` - Vehicle management
2. ✅ `/VEHICLE_TRACKING_FLOW.md` - This documentation

### **Updated:**
1. ✅ `/components/dashboard/TrackingTab.tsx` - Added category filters
2. ✅ `/supabase/functions/server/index.tsx` - Added vehicle endpoints

### **Removed:**
- ❌ HistoryTab (merged into VehiclesTab)

---

## 🚗 **VEHICLES TAB**

### **Features:**

#### **1. Add Vehicle**
```jsx
<Form>
  <Input name="plate_number" placeholder="B 1234 XYZ" />
  <Input name="brand" placeholder="Honda, Yamaha" />
  <Input name="model" placeholder="Beat, Vario" />
  <Input name="year" type="number" />
  <Input name="engine_capacity" placeholder="110, 125" />
  <Input name="color" placeholder="Hitam, Putih" />
</Form>
```

#### **2. Vehicle List**
```jsx
{vehicles.map(vehicle => (
  <Card>
    <CardHeader>
      <Car icon /> {vehicle.brand} {vehicle.model}
      <Badge>{vehicle.year}</Badge>
      <PlateNumber>{vehicle.plate_number}</PlateNumber>
      <Button onClick={expand}>Lihat Riwayat</Button>
    </CardHeader>
    
    {expanded && (
      <ServiceHistory>
        {bookings.map(booking => ...)}
      </ServiceHistory>
    )}
  </Card>
))}
```

#### **3. Service History (per Vehicle)**
```jsx
<ServiceHistory>
  <Booking>
    <Status badge>Selesai</Status>
    <JobNumber>JO-2026-123456</JobNumber>
    <Date>15 Jan 2026</Date>
    <Service>Hemat Service</Service>
    <Total>Rp 185,000</Total>
    <Items>
      - Oli Mesin Federal (1x)
      - Filter Oli Honda (1x)
    </Items>
  </Booking>
</ServiceHistory>
```

---

## 🎯 **TRACKING TAB (UPDATED)**

### **Category Filters:**

```jsx
const filterCategories = [
  { key: 'all', label: 'Semua' },
  { key: 'pending', label: 'Menunggu' },
  { key: 'scheduled', label: 'Dijadwalkan' },
  { key: 'in_progress', label: 'Sedang Diperbaiki' },
  { key: 'completed', label: 'Selesai' }
];
```

### **Filter UI:**
```jsx
<Filters>
  {categories.map(cat => (
    <Button 
      active={activeFilter === cat.key}
      onClick={() => setActiveFilter(cat.key)}
    >
      {cat.label}
      <Badge>{count}</Badge>
    </Button>
  ))}
</Filters>
```

### **Real-time Updates:**
```javascript
useEffect(() => {
  fetchCustomerBookings();
  
  // Auto-refresh every 5 seconds
  const interval = setInterval(fetchCustomerBookings, 5000);
  return () => clearInterval(interval);
}, [user]);
```

### **Visual Timeline:**
```jsx
<Timeline>
  <Step active={status >= 'pending'}>
    <Clock /> Menunggu
  </Step>
  <Step active={status >= 'scheduled'}>
    <Calendar /> Dijadwalkan
  </Step>
  <Step active={status >= 'in_progress'}>
    <Wrench /> Sedang Diperbaiki
  </Step>
  <Step active={status === 'completed'}>
    <CheckCircle2 /> Selesai
  </Step>
</Timeline>
```

---

## 🔌 **API ENDPOINTS**

### **Vehicles:**

#### **1. Get Customer Vehicles**
```
GET /vehicles/customer/:customerId
Response: [
  {
    id: "uuid",
    customer_id: "uuid",
    plate_number: "B 1234 XYZ",
    brand: "Honda",
    model: "Beat",
    year: 2023,
    engine_capacity: "110",
    color: "Hitam"
  }
]
```

#### **2. Create Vehicle**
```
POST /vehicles
Body: {
  customer_id: "uuid",
  plate_number: "B 1234 XYZ",
  brand: "Honda",
  model: "Beat",
  year: 2023,
  engine_capacity: "110",
  color: "Hitam"
}
```

#### **3. Get Vehicle Bookings (Riwayat)**
```
GET /vehicles/:vehicleId/bookings
Response: [
  {
    id: "uuid",
    job_number: "JO-2026-123456",
    status: "completed",
    total_amount: 185000,
    service: { name: "Hemat Service" },
    vehicle: { plate_number: "B 1234 XYZ" },
    job_parts: [
      {
        quantity_used: 1,
        inventory: { part_name: "Oli Mesin" }
      }
    ]
  }
]
```

### **Tracking:**

#### **Get Customer Bookings with Filter**
```javascript
// Fetch all bookings
GET /bookings/customer/:customerId

// Frontend filtering
const filteredBookings = activeFilter === 'all' 
  ? bookings 
  : bookings.filter(b => b.status === activeFilter);
```

---

## 💡 **USER EXPERIENCE**

### **Customer Journey:**

#### **1. Add Vehicle**
```
Dashboard → Vehicles Tab → "Tambah Kendaraan"
→ Fill form → Save
→ ✅ Vehicle added!
```

#### **2. View Service History**
```
Dashboard → Vehicles Tab
→ Select vehicle → "Lihat Riwayat"
→ Expand card
→ See all past services:
  - Dates, status, items
  - Total amounts
  - Service packages
```

#### **3. Track Active Bookings**
```
Dashboard → Tracking Tab
→ Select category filter
→ [Menunggu] → See pending bookings
→ [Dijadwalkan] → See scheduled bookings
→ [Sedang Diperbaiki] → See in-progress
→ [Selesai] → See completed
→ Auto-update every 5s
```

---

## 🎨 **UI COMPONENTS**

### **Vehicle Card:**
```jsx
<Card hover>
  <CardHeader>
    <Icon>🚗</Icon>
    <Title>Honda Beat 2023</Title>
    <Badge>2023</Badge>
    <PlateNumber>B 1234 XYZ</PlateNumber>
    <Details>110 cc • Hitam</Details>
    <Button>
      {expanded ? "Tutup" : "Lihat Riwayat"}
    </Button>
  </CardHeader>
  
  {expanded && (
    <CardContent>
      <ServiceHistory>
        {bookings.map(...)}
      </ServiceHistory>
    </CardContent>
  )}
</Card>
```

### **Service History Item:**
```jsx
<HistoryCard>
  <StatusBadge color={status.color}>
    <Icon /> {status.label}
  </StatusBadge>
  <JobNumber>JO-2026-123456</JobNumber>
  <Date>15 Jan 2026, 10:00</Date>
  <Grid>
    <Service>Hemat Service</Service>
    <Total>Rp 185,000</Total>
  </Grid>
  <ItemsList>
    • Oli Mesin Federal (1x)
    • Filter Oli Honda (1x)
  </ItemsList>
</HistoryCard>
```

### **Tracking Filter Buttons:**
```jsx
<FilterBar>
  <Button active={filter === 'all'}>
    Semua
    <Badge>12</Badge>
  </Button>
  <Button active={filter === 'pending'}>
    Menunggu
    <Badge>3</Badge>
  </Button>
  <Button active={filter === 'scheduled'}>
    Dijadwalkan
    <Badge>5</Badge>
  </Button>
  <Button active={filter === 'in_progress'}>
    Sedang Diperbaiki
    <Badge>2</Badge>
  </Button>
  <Button active={filter === 'completed'}>
    Selesai
    <Badge>2</Badge>
  </Button>
</FilterBar>
```

---

## 🔄 **REAL-TIME FLOW**

### **Scenario 1: Customer adds vehicle**
```
1. Customer fills form → POST /vehicles
2. Vehicle saved to database
3. List auto-refreshed
4. ✅ New vehicle appears
```

### **Scenario 2: Customer expands vehicle**
```
1. Click "Lihat Riwayat"
2. GET /vehicles/:id/bookings
3. Load service history
4. Show all past bookings
```

### **Scenario 3: Admin approves booking**
```
1. Admin clicks "Setujui"
2. PUT /bookings/:id/status
3. Status → 'scheduled'
4. Customer tracking auto-updates (5s)
5. ✅ Status badge changes
6. Timeline progress updates
```

### **Scenario 4: Filter bookings**
```
1. Customer clicks "Dijadwalkan"
2. Frontend filters: bookings.filter(b => b.status === 'scheduled')
3. Show only scheduled bookings
4. Count badge updates
```

---

## 📊 **DATABASE INTEGRATION**

### **Vehicles Table:**
```sql
CREATE TABLE vehicles (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id),
  plate_number TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  engine_capacity TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Query: Get Vehicle Bookings**
```sql
SELECT 
  jo.*,
  s.name as service_name,
  v.plate_number,
  jp.quantity_used,
  i.part_name
FROM job_orders jo
JOIN services s ON s.id = jo.service_id
JOIN vehicles v ON v.id = jo.vehicle_id
LEFT JOIN job_parts jp ON jp.job_order_id = jo.id
LEFT JOIN inventory i ON i.id = jp.inventory_id
WHERE jo.vehicle_id = :vehicleId
ORDER BY jo.created_at DESC;
```

---

## ✅ **BENEFITS**

### **For Customers:**
- 🚗 **Easy vehicle management**
- 📋 **Clear service history per vehicle**
- 🎯 **Filter tracking by status**
- ⚡ **Real-time updates (5s)**
- 🧹 **Clean, organized UI**

### **For Business:**
- 📊 **Better data organization**
- 🔄 **Real-time synchronization**
- 💾 **Centralized vehicle records**
- 📈 **Track service patterns**
- 🎨 **Improved UX**

---

## 🎊 **SUMMARY**

### **What Changed:**
1. ✅ **VehiclesTab** created - manage vehicles & riwayat
2. ✅ **TrackingTab** updated - category filters
3. ✅ **HistoryTab** removed - merged into VehiclesTab
4. ✅ **Vehicle endpoints** added to server
5. ✅ **Real-time updates** everywhere

### **Key Features:**
- 🚗 Add/view vehicles
- 📋 Service history per vehicle
- 🎯 Filter tracking by category
- ⚡ Auto-refresh (5s/10s)
- 🔄 Real-time database sync

### **User Flow:**
```
Add Vehicle → Book Service → Track Status → View History
     ↓              ↓              ↓              ↓
  VehiclesTab   BookingTab    TrackingTab   VehiclesTab
                                              (expand)
```

---

**Last Updated:** February 3, 2026  
**Sunest Auto Platform** - Complete Vehicle & Tracking System
