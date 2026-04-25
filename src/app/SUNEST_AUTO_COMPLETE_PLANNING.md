# 🏍️ SUNEST AUTO - Complete Platform Planning
## Comprehensive Digital Workshop Management System

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Tech Stack](#tech-stack)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Complete Feature List](#complete-feature-list)
5. [Database Schema](#database-schema)
6. [Customer Features](#customer-features)
7. [Admin Dashboard Features](#admin-dashboard-features)
8. [Booking Flow (Customer Journey)](#booking-flow-customer-journey)
9. [Loyalty Program](#loyalty-program)
10. [Wanda AI Chatbot](#wanda-ai-chatbot)
11. [Self-Service Platform](#self-service-platform)
12. [QR Code System](#qr-code-system)
13. [Automated Service Scheduling](#automated-service-scheduling)
14. [Real-time Tracking](#real-time-tracking)
15. [Admin Operations](#admin-operations)
16. [Analytics & Reporting](#analytics--reporting)
17. [UI/UX Design System](#uiux-design-system)
18. [Business Rules](#business-rules)
19. [API Endpoints](#api-endpoints)
20. [Security & Authentication](#security--authentication)
21. [Success Metrics (KPIs)](#success-metrics-kpis)
22. [Implementation Roadmap](#implementation-roadmap)

---

## 🎯 EXECUTIVE SUMMARY

**Sunest Auto** adalah platform digital komprehensif untuk bengkel motor modern yang menggabungkan:
- 🤖 **AI-Powered**: Wanda AI Chatbot dengan NLP
- 📱 **Smart Booking**: QR check-in & real-time tracking
- 🎁 **Loyalty Program**: Rewards & referral system
- 📊 **Analytics**: Complete business intelligence
- 🔄 **Automation**: Smart reminders & predictive scheduling

### Core Value Propositions

**For Customers:**
- ✅ Book service online dengan promo GRATIS biaya jasa
- ✅ Real-time tracking progress servis
- ✅ QR check-in untuk fast processing
- ✅ Loyalty rewards (free oil every 4 visits!)
- ✅ AI chatbot 24/7 untuk bantuan
- ✅ Smart service reminders

**For Workshop Owners:**
- ✅ Complete customer management (CRM)
- ✅ Automated scheduling & queue management
- ✅ Inventory & financial tracking
- ✅ Customer analytics & insights
- ✅ Boost retention dengan loyalty program
- ✅ Reduce workload dengan AI automation

---

## 🛠️ TECH STACK

### Frontend
```typescript
Framework: Next.js 14 (React 18)
Styling: Tailwind CSS v4
UI Components: Shadcn/ui
Animations: Framer Motion (motion/react)
Icons: Lucide React
Charts: Recharts
Notifications: Sonner Toast
State Management: React Hooks + Context API
Real-time: Supabase Realtime subscriptions
```

### Backend
```typescript
Database: Supabase (PostgreSQL)
  Project: sunest-auto-new
  ID: tvugghippwvoxsjqyxkr
  
API Server: Supabase Edge Functions (Hono)
  Pattern: Three-tier architecture
  Base: /functions/v1/make-server-c1ef5280

Authentication: Supabase Auth
  Methods: Email/Password, Social (Google, Facebook)
  
Storage: Supabase Storage
  - QR codes
  - Vehicle photos
  - Service photos (before/after)
  - Invoices/receipts
  
Real-time: Supabase Realtime
  - Job status updates
  - Queue management
  - Live chat
```

### AI & Automation
```typescript
Chatbot Engine: Dialogflow / Rasa (Indonesian NLP)
NLP: TensorFlow.js / Hugging Face
Intent Recognition: Custom ML model
Sentiment Analysis: For review analysis
Recommendation Engine: Collaborative filtering

Notifications:
  - Email: SendGrid / Resend
  - SMS: Twilio / Vonage
  - Push: Firebase Cloud Messaging (FCM)
```

### Infrastructure
```typescript
Hosting: Vercel / Netlify
CDN: Cloudflare
Monitoring: Sentry
Analytics: Google Analytics + Custom events
QR Generator: qrcode.js
Payment (Future): Midtrans / Xendit
```

---

## 👥 USER ROLES & PERMISSIONS

### 1. 👤 CUSTOMER (User)

**Full Access:**
```javascript
✅ Customer Features
├─ 📱 Personal Dashboard
├─ 🏍️ Vehicle Management (CRUD own vehicles)
├─ 📅 Book Service (online booking with Rp 0 fee)
├─ 📍 Real-time Job Tracking
├─ 🎁 Loyalty Points & Rewards
├─ 📜 Service History & Invoices
├─ 🤖 Chat with Wanda AI
├─ 📊 Self-service Tools (FAQ, Calculator)
├─ 🔔 Notifications (reminders, updates)
├─ ⭐ Rate & Review services
├─ 👤 Profile Management
└─ 📱 QR Code for Check-in
```

**Restricted:**
```javascript
❌ Cannot Access
├─ Admin dashboard
├─ Other customers' data
├─ Inventory management
├─ Financial reports
├─ System settings
└─ Mechanic/technician management
```

---

### 2. 🔧 ADMIN (Workshop Owner/Manager)

**Full Access:**
```javascript
✅ Admin Features
├─ 📊 Complete Dashboard (stats, analytics)
├─ 📋 Booking Management
│   ├─ View all bookings (calendar, list, queue)
│   ├─ Create manual booking (walk-in/phone)
│   ├─ Edit/reschedule bookings
│   ├─ Cancel with reason
│   └─ QR code generation
│
├─ 👥 Customer Management (CRM)
│   ├─ Customer database
│   ├─ Vehicle database
│   ├─ Interaction history
│   ├─ Segmentation (new, active, dormant, VIP)
│   └─ Bulk notifications
│
├─ 🔧 Service Operations
│   ├─ Queue management
│   ├─ Assign mechanic/technician
│   ├─ Update job status & progress
│   ├─ Add spare parts to jobs
│   ├─ Generate invoices
│   └─ Service reports
│
├─ 📦 Inventory Management
│   ├─ Spare parts stock
│   ├─ Low stock alerts
│   ├─ Add/edit/delete parts
│   └─ Stock movement history
│
├─ 👨‍🔧 Technician Management
│   ├─ Add/edit technicians
│   ├─ Assign to jobs
│   ├─ Performance tracking
│   └─ Workload balancing
│
├─ 🎁 Loyalty & Rewards
│   ├─ Configure loyalty rules
│   ├─ Points management
│   ├─ Reward catalog
│   ├─ Referral settings
│   └─ Manual point adjustments
│
├─ 🤖 Chatbot Management
│   ├─ Intent training
│   ├─ Response editor
│   ├─ Fallback logs
│   ├─ Human handover
│   └─ Chatbot analytics
│
├─ 💰 Financial Reports
│   ├─ Revenue reports
│   ├─ Booking reports
│   ├─ Customer reports
│   ├─ Service performance
│   └─ Export to Excel/PDF
│
├─ ⚙️ System Settings
│   ├─ Business hours
│   ├─ Service types & pricing
│   ├─ Notification templates
│   └─ API integrations
│
└─ 📊 Analytics Dashboard
    ├─ Revenue charts
    ├─ Customer analytics
    ├─ Service trends
    └─ KPI monitoring
```

---

## ⚡ COMPLETE FEATURE LIST

### 🔵 CUSTOMER FEATURES (User App)

#### 1. **Registration & Onboarding**
```
Flow:
1. Sign Up (Email/Password or Social)
2. Email Verification
3. Complete Profile
   ├─ Full Name *
   ├─ Phone Number *
   ├─ Email *
   └─ Address (optional)
4. Add First Vehicle
   ├─ Brand * (dropdown: Yamaha, Honda, Suzuki, Kawasaki, dll)
   ├─ Model/Type *
   ├─ Plate Number * (format: X 0000 XXX)
   ├─ Year
   ├─ Color
   ├─ Current Mileage (km)
   └─ Upload Photo (optional)
5. Welcome Screen
   └─ Tutorial/Tour (optional skip)
```

#### 2. **Customer Dashboard**
```
┌─────────────────────────────────────────┐
│ 👋 Hi, Budi!                            │
│                                         │
│ ┌───────┬───────┬───────┬───────┐      │
│ │ 🏍️ 2  │ 🔄 1  │ ✅ 12 │ 🎁 8  │      │
│ │Kend.  │Aktif  │Selesai│Poin   │      │
│ └───────┴───────┴───────┴───────┘      │
│                                         │
│ 🎁 Loyalty Progress                     │
│ ▓▓▓░░ 3/4 servis → FREE OIL!           │
│                                         │
│ 📅 Service Aktif                        │
│ ┌─────────────────────────────┐        │
│ │ JOB-2026-001 | In Progress  │        │
│ │ Yamaha NMAX - Tune Up       │        │
│ │ ⚠️ 70% Complete             │        │
│ │ [Track Progress]            │        │
│ └─────────────────────────────┘        │
│                                         │
│ 🏍️ My Vehicles (Quick Access)          │
│ [Yamaha NMAX] [Honda Vario]            │
│                                         │
│ 🔔 Reminders                            │
│ • NMAX due for service (3500 km)       │
│ • Vario service in 2 weeks              │
│                                         │
│ ➕ [Book New Service]                   │
└─────────────────────────────────────────┘
```

**Widgets:**
- **Quick Stats**: Total kendaraan, service aktif, completed, loyalty points
- **Loyalty Progress Bar**: Visual progress to next reward
- **Active Jobs**: Real-time status dengan progress %
- **My Vehicles**: Quick access cards
- **Smart Reminders**: AI-powered service alerts
- **Quick Actions**: Book service, add vehicle, chat AI

#### 3. **Booking Service (Customer Journey)**

**Complete Flow:**
```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│   REGISTER  │───►│ LENGKAPI     │───►│ BOOKING      │
│   & LOGIN   │    │ DATA PROFILE │    │ SERVIS       │
└─────────────┘    └──────────────┘    └──────┬───────┘
                                              │
┌─────────────┐    ┌──────────────┐          ▼
│  SELESAI &  │◄───│ SERVIS &     │◄──┌──────────────┐
│   REVIEW    │    │ PROGRESS     │   │ DATANG &     │
└─────────────┘    └──────────────┘   │ CHECK-IN QR  │
                                       └──────────────┘
```

**Detailed Steps:**

**STEP 1: Pilih Kendaraan**
```
┌─────────────────────────────────┐
│ Pilih Kendaraan untuk Service  │
├─────────────────────────────────┤
│                                 │
│ ○ 🏍️ Yamaha NMAX               │
│   B 1234 XYZ - 2020             │
│   Last service: 15 Jan 2026     │
│                                 │
│ ○ 🏍️ Honda Vario 160           │
│   B 5678 ABC - 2021             │
│   Last service: 1 Feb 2026      │
│                                 │
│ ➕ [Tambah Kendaraan Baru]      │
│                                 │
│         [Lanjut] ───────►       │
└─────────────────────────────────┘
```

**STEP 2: Pilih Service & Keluhan**
```
┌─────────────────────────────────┐
│ Jenis Service                   │
├─────────────────────────────────┤
│ ○ Basic Tune-Up                 │
│ ○ Oil Change                    │
│ ○ Brake Service                 │
│ ○ Electrical Check              │
│ ○ Tire Replacement              │
│ ○ Engine Overhaul               │
│ ○ Custom (tulis di keluhan)     │
│                                 │
│ Keluhan/Catatan:                │
│ ┌─────────────────────────────┐ │
│ │ Mesin terasa kurang bertenaga│ │
│ │ saat tanjakan...            │ │
│ └─────────────────────────────┘ │
│                                 │
│ Current Mileage:                │
│ [____3500____] km               │
│                                 │
│    [Kembali]    [Lanjut] ─────► │
└─────────────────────────────────┘
```

**STEP 3: Pilih Jadwal**
```
┌─────────────────────────────────┐
│ Pilih Tanggal & Waktu          │
├─────────────────────────────────┤
│                                 │
│ 📅 Tanggal: [07 Feb 2026] ▼    │
│                                 │
│ ⏰ Pilih Waktu:                 │
│                                 │
│ ┌──────────────┐ ✅ Available  │
│ │ 08:00-10:00  │ 2 slots left  │
│ └──────────────┘                │
│                                 │
│ ┌──────────────┐ ✅ Available  │
│ │ 10:00-12:00  │ 3 slots left  │
│ └──────────────┘                │
│                                 │
│ ┌──────────────┐ ⚠️ Limited    │
│ │ 13:00-15:00  │ 1 slot left   │
│ └──────────────┘                │
│                                 │
│ ┌──────────────┐ 🔴 Full       │
│ │ 15:00-17:00  │ Fully booked  │
│ └──────────────┘                │
│                                 │
│ ℹ️ Harap datang 30 menit        │
│    sebelum jadwal               │
│                                 │
│    [Kembali]    [Lanjut] ─────► │
└─────────────────────────────────┘
```

**STEP 4: Konfirmasi Booking**
```
┌─────────────────────────────────┐
│ Konfirmasi Booking             │
├─────────────────────────────────┤
│ 🏍️ Kendaraan:                   │
│ Yamaha NMAX (B 1234 XYZ)        │
│                                 │
│ 🔧 Service:                     │
│ Basic Tune-Up                   │
│                                 │
│ 📅 Jadwal:                      │
│ Jumat, 7 Feb 2026               │
│ 08:00 - 10:00 WIB               │
│                                 │
│ 💬 Keluhan:                     │
│ Mesin terasa kurang bertenaga   │
│ saat tanjakan                   │
│                                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                 │
│ 💰 ESTIMASI BIAYA:              │
│                                 │
│ Service Fee: Rp 0               │
│ 🎉 GRATIS - Promo Online!       │
│                                 │
│ Spare Parts: TBD                │
│ (Akan ditentukan saat service)  │
│                                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                 │
│ ⚠️ PENTING:                     │
│ • Datang 30 menit sebelum       │
│ • Bawa KTP & STNK               │
│ • Siapkan QR code check-in      │
│                                 │
│ [✅ Booking Sekarang]           │
└─────────────────────────────────┘
```

**STEP 5: Booking Success**
```
┌─────────────────────────────────┐
│         ✅ BOOKING SUKSES!      │
├─────────────────────────────────┤
│                                 │
│ Job Number:                     │
│ ┌─────────────────────────────┐ │
│ │     JOB-2026-0207-001       │ │
│ └─────────────────────────────┘ │
│                                 │
│ Your QR Code:                   │
│ ┌─────────────────────────────┐ │
│ │     ██▀▀▀█ █  █ ██▀▀▀█     │ │
│ │     █   █ ▄█▄ █ █   █      │ │
│ │     █▄▄▄█ ███ █ █▄▄▄█      │ │
│ │     (QR Code Image)         │ │
│ └─────────────────────────────┘ │
│                                 │
│ Scan QR ini saat check-in!      │
│                                 │
│ 📧 Konfirmasi dikirim ke email  │
│ 📱 Simpan QR code di galeri     │
│                                 │
│ [Download QR] [Track Progress]  │
│                                 │
│ Reminder akan dikirim:          │
│ • 1 hari sebelum                │
│ • 1 jam sebelum                 │
└─────────────────────────────────┘
```

#### 4. **Real-time Job Tracking**

**Path:** `/customer/jobs/[id]`

```
┌─────────────────────────────────────────┐
│ 🔍 JOB-2026-0207-001                    │
│ Status: 🔄 IN PROGRESS (70%)            │
├─────────────────────────────────────────┤
│                                         │
│ ━━━━━━━━━ PROGRESS TIMELINE ━━━━━━━━━  │
│                                         │
│ ✅ Booking Created                      │
│ 📅 6 Feb 2026, 14:30                    │
│                                         │
│ ✅ Booking Confirmed                    │
│ 📅 6 Feb 2026, 14:45                    │
│ 👤 By: Admin                            │
│                                         │
│ ✅ Checked In (QR Scanned)              │
│ 📅 7 Feb 2026, 07:45                    │
│ 📍 Location verified                    │
│                                         │
│ ✅ Technician Assigned                  │
│ 📅 7 Feb 2026, 08:00                    │
│ 👨‍🔧 Andi Pratama (⭐ 4.8)                │
│                                         │
│ 🔄 Service In Progress (CURRENT)        │
│ 📅 7 Feb 2026, 08:15                    │
│ 💬 "Sedang cek mesin dan oli..."        │
│ Updated: 2 min ago                      │
│                                         │
│ ⏳ Quality Check (PENDING)              │
│ Est: 09:30                              │
│                                         │
│ ⏳ Completed (PENDING)                  │
│ Est: 10:00                              │
│                                         │
│ ━━━━━━━━━━ SERVICE DETAILS ━━━━━━━━━━  │
│                                         │
│ 🏍️ Vehicle: Yamaha NMAX (B 1234 XYZ)   │
│ 🔧 Service: Basic Tune-Up               │
│ 📅 Scheduled: 7 Feb 2026, 08:00-10:00   │
│ 👨‍🔧 Technician: Andi Pratama             │
│                                         │
│ ━━━━━━━━━━ PRICING BREAKDOWN ━━━━━━━━━  │
│                                         │
│ Service Fee:            Rp 0            │
│ 🎉 (Promo Online Booking)               │
│                                         │
│ Spare Parts Used:                       │
│ ├─ Oli Yamalube 1L      Rp 75.000       │
│ ├─ Filter Oli           Rp 25.000       │
│ └─ Busi NGK             Rp 35.000       │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│ TOTAL:                  Rp 135.000      │
│                                         │
│ ━━━━━━━━━━━ TECHNICIAN NOTES ━━━━━━━━━  │
│                                         │
│ 💬 "Kondisi mesin bagus, oli sudah      │
│     diganti. Filter agak kotor jadi     │
│     perlu ganti. Busi masih layak."     │
│                                         │
│ ⚠️ Recommendations:                     │
│ • Ganti kampas rem dalam 1 bulan        │
│ • Service berikutnya: 6500 km           │
│                                         │
│ [💬 Chat dengan Teknisi]                │
│ [🔔 Subscribe Updates]                  │
└─────────────────────────────────────────┘
```

**Real-time Features:**
- ✅ Auto-refresh every 10 seconds
- ✅ Push notification on status change
- ✅ Live chat with technician
- ✅ Parts added notification
- ✅ ETA updates

#### 5. **Loyalty Program - Customer View**

**Path:** `/customer/loyalty`

```
┌─────────────────────────────────────────┐
│ 🎁 MY LOYALTY REWARDS                   │
├─────────────────────────────────────────┤
│                                         │
│ Total Points: 850 pts                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                         │
│ 🛢️ FREE OIL PROGRESS                    │
│ ┌─────────────────────────────┐        │
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░             │        │
│ │ 3 / 4 services                │        │
│ └─────────────────────────────┘        │
│ 🎉 1 service lagi = FREE OIL!           │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                         │
│ 💎 AVAILABLE REWARDS                    │
│                                         │
│ ┌───────────────────────────────┐      │
│ │ 🛢️ Free Oli Yamalube           │      │
│ │ 500 pts                        │      │
│ │ [Redeem Now]                  │      │
│ └───────────────────────────────┘      │
│                                         │
│ ┌───────────────────────────────┐      │
│ │ 🧽 Free Car Wash               │      │
│ │ 300 pts                        │      │
│ │ [Redeem Now]                  │      │
│ └───────────────────────────────┘      │
│                                         │
│ ┌───────────────────────────────┐      │
│ │ 💰 Diskon Rp 50.000            │      │
│ │ 1000 pts (🔒 50 pts lagi!)    │      │
│ └───────────────────────────────┘      │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                         │
│ 👥 REFERRAL PROGRAM                     │
│                                         │
│ Your Referral Code: BUDI2026            │
│ ┌─────────────────────────────┐        │
│ │ Share & earn 100 pts!       │        │
│ │ [📱 Share Code]              │        │
│ └─────────────────────────────┘        │
│                                         │
│ Referrals: 3 friends joined             │
│ Earned: 300 pts                         │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                         │
│ 📜 POINTS HISTORY                       │
│                                         │
│ + 100 pts  Service completed            │
│            JOB-2026-001 | 5 Feb         │
│                                         │
│ + 100 pts  Referral: Siti joined        │
│            3 Feb 2026                   │
│                                         │
│ - 500 pts  Redeemed: Free Oli           │
│            1 Feb 2026                   │
│                                         │
│ [View All History]                      │
└─────────────────────────────────────────┘
```

**Loyalty Rules:**
- ✅ **Free Oil Program**: Setiap 4x service = 1 free oil change
- ✅ **Points System**: 
  - Earn 100 pts per service
  - Earn 100 pts per referral
  - Bonus 50 pts on birthday month
- ✅ **Referral**: Share code, friend books → both get 100 pts
- ✅ **Redemption**: Points for rewards, discounts, free services

#### 6. **Wanda AI Chatbot**

**Path:** Floating chat widget (accessible from any page)

```
┌─────────────────────────────────────────┐
│ 🤖 Chat with Wanda AI                   │
├─────────────────────────────────────────┤
│                                         │
│ 👤 You:                                 │
│ Mau booking servis besok jam 10         │
│                                 [14:32] │
│                                         │
│ 🤖 Wanda:                               │
│ Halo! Saya bantu booking ya 😊          │
│                                         │
│ Untuk kendaraan apa?                    │
│ 1️⃣ Yamaha NMAX (B 1234 XYZ)            │
│ 2️⃣ Honda Vario (B 5678 ABC)            │
│                                 [14:32] │
│                                         │
│ 👤 You:                                 │
│ Yang NMAX                               │
│                                 [14:33] │
│                                         │
│ 🤖 Wanda:                               │
│ Oke! Yamaha NMAX ya.                    │
│ Jenis service apa yang dibutuhkan?      │
│                                         │
│ [Oil Change] [Tune-Up] [Brake]          │
│ [Electrical] [Custom]                   │
│                                 [14:33] │
│                                         │
│ 👤 You:                                 │
│ Tune up aja                             │
│                                 [14:34] │
│                                         │
│ 🤖 Wanda:                               │
│ Siap! Saya cek slot besok jam 10...     │
│                                         │
│ ✅ Slot tersedia:                       │
│ 📅 8 Feb 2026, 10:00-12:00              │
│                                         │
│ Lanjut booking? [Ya] [Ubah Waktu]       │
│                                 [14:34] │
│                                         │
│ ─────────────────────────────           │
│ [Type a message...]           [Send]    │
└─────────────────────────────────────────┘
```

**Wanda AI Capabilities:**

**Supported Intents:**
```javascript
1. book_service
   - "Mau booking servis besok"
   - "Book tune up untuk NMAX"
   - "Jadwalin service minggu depan"

2. check_status
   - "Status booking saya"
   - "Job JOB-2026-001 udah sampe mana?"
   - "Motorku udah selesai belum?"

3. service_history
   - "Riwayat servis motor"
   - "Kapan terakhir ganti oli?"
   - "History NMAX"

4. loyalty_points
   - "Cek poin saya"
   - "Poin loyalty berapa?"
   - "Kapan dapet free oil?"

5. price_inquiry
   - "Berapa biaya ganti oli?"
   - "Harga tune up berapa?"
   - "Estimasi biaya brake service?"

6. location
   - "Alamat bengkel"
   - "Lokasi Sunest Auto"
   - "Jam buka?"

7. complaint
   - "Motor saya masalah..."
   - "Komplain service"
   - Sentiment: Negative → Escalate to human

8. general_faq
   - "Cara booking?"
   - "Payment method?"
   - "Bisa reschedule?"
```

**AI Features:**
- ✅ **Indonesian NLP**: Understand bahasa sehari-hari
- ✅ **Context Awareness**: Remember conversation context
- ✅ **Intent Recognition**: 95%+ accuracy
- ✅ **Entity Extraction**: Date, time, vehicle, service type
- ✅ **Sentiment Analysis**: Detect unhappy customers
- ✅ **Human Handover**: Transfer to CS if confidence < 80%
- ✅ **Quick Actions**: Button shortcuts
- ✅ **Typing Indicator**: "Wanda is typing..."
- ✅ **Multi-turn Dialog**: Handle complex conversations

#### 7. **Self-Service Platform**

**Path:** `/customer/help`

```
┌─────────────────────────────────────────┐
│ 🛠️ HELP CENTER                          │
├─────────────────────────────────────────┤
│                                         │
│ 🔍 Search: [_________________] 🔎      │
│                                         │
│ ━━━━━━━━━━ POPULAR TOPICS ━━━━━━━━━━   │
│                                         │
│ 📋 FAQ                                  │
│ ├─ How to book service?                 │
│ ├─ Payment methods                      │
│ ├─ Cancel/reschedule booking            │
│ ├─ Loyalty program                      │
│ └─ QR code check-in                     │
│                                         │
│ 💰 SERVICE CALCULATOR                   │
│ ┌─────────────────────────────┐        │
│ │ Estimate Your Service Cost  │        │
│ │                             │        │
│ │ Vehicle: [Yamaha NMAX ▼]    │        │
│ │ Service: [Oil Change ▼]     │        │
│ │                             │        │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━   │        │
│ │ Estimated Cost:             │        │
│ │ Service Fee: Rp 0 (Promo!)  │        │
│ │ Parts: ~Rp 75.000           │        │
│ │ Total: ~Rp 75.000           │        │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━   │        │
│ │                             │        │
│ │ [📅 Book Now]               │        │
│ └─────────────────────────────┘        │
│                                         │
│ 📖 DIGITAL MANUAL BOOK                  │
│ ├─ Yamaha NMAX Manual                   │
│ ├─ Honda Vario Manual                   │
│ ├─ Suzuki GSX Manual                    │
│ └─ [+ Request Manual]                   │
│                                         │
│ 🔧 TROUBLESHOOTING                      │
│ ├─ Mesin tidak mau hidup                │
│ ├─ Rem kurang pakem                     │
│ ├─ Lampu indikator menyala              │
│ └─ Suara berisik saat jalan             │
│                                         │
│ 📹 VIDEO TUTORIALS                      │
│ ├─ Cara cek oli mesin                   │
│ ├─ Tips rawat rantai                    │
│ └─ Ganti ban motor sendiri              │
│                                         │
│ 💬 Still need help?                     │
│ [🤖 Chat Wanda AI] [📞 Call Support]    │
└─────────────────────────────────────────┘
```

#### 8. **Service History & Invoices**

**Path:** `/customer/history`

```
┌─────────────────────────────────────────┐
│ 📜 SERVICE HISTORY                      │
├─────────────────────────────────────────┤
│                                         │
│ 🔍 Filter:                              │
│ Vehicle: [All ▼] Status: [All ▼]        │
│ Date: [Last 3 months ▼]                 │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                         │
│ ┌───────────────────────────────┐      │
│ │ ✅ JOB-2026-0205-001           │      │
│ │ 5 Feb 2026 | Completed         │      │
│ │                                │      │
│ │ 🏍️ Yamaha NMAX (B 1234 XYZ)   │      │
│ │ 🔧 Basic Tune-Up               │      │
│ │ 👨‍🔧 Andi Pratama (⭐ 4.8)       │      │
│ │                                │      │
│ │ 💰 Total: Rp 135.000           │      │
│ │ 📄 Paid                        │      │
│ │                                │      │
│ │ [View Detail] [Invoice] [⭐ Rate]│    │
│ └───────────────────────────────┘      │
│                                         │
│ ┌───────────────────────────────┐      │
│ │ 🔄 JOB-2026-0207-001           │      │
│ │ 7 Feb 2026 | In Progress       │      │
│ │                                │      │
│ │ 🏍️ Yamaha NMAX (B 1234 XYZ)   │      │
│ │ 🔧 Oil Change                  │      │
│ │ 👨‍🔧 Budi Santoso              │      │
│ │                                │      │
│ │ Progress: 70%                  │      │
│ │                                │      │
│ │ [Track Progress]               │      │
│ └───────────────────────────────┘      │
│                                         │
│ [Load More...]                          │
└─────────────────────────────────────────┘
```

**Invoice Detail:**
```
┌─────────────────────────────────────────┐
│ 📄 INVOICE                              │
│ INV-2026-0205-001                       │
├─────────────────────────────────────────┤
│                                         │
│ Sunest Auto Workshop                    │
│ Jl. Raya Motor No. 123, Jakarta         │
│ Tel: (021) 1234-5678                    │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                         │
│ Job Number: JOB-2026-0205-001           │
│ Date: 5 Feb 2026, 10:30                 │
│ Customer: Budi Santoso                  │
│ Phone: 0812-3456-7890                   │
│                                         │
│ Vehicle: Yamaha NMAX (B 1234 XYZ)       │
│ Mileage: 3500 km                        │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                         │
│ SERVICE DETAILS:                        │
│                                         │
│ Basic Tune-Up                           │
│ Service Fee (Online Booking)    Rp 0    │
│ 🎉 Promo Applied                        │
│                                         │
│ SPARE PARTS:                            │
│ 1x Oli Yamalube 10W-40         75.000   │
│ 1x Filter Oli                  25.000   │
│ 1x Busi NGK                    35.000   │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│ Subtotal:                     135.000   │
│ Discount:                           0   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│ TOTAL:               Rp 135.000         │
│                                         │
│ Payment Method: Cash                    │
│ Status: ✅ PAID                         │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                         │
│ Technician: Andi Pratama                │
│ Notes: Kondisi mesin baik. Service      │
│        berikutnya di 6500 km            │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                         │
│ 🎁 +100 Loyalty Points earned!          │
│ 🛢️ 1/4 progress to FREE OIL!            │
│                                         │
│ [📥 Download PDF] [📧 Email] [🖨️ Print] │
│                                         │
│ Thank you for choosing Sunest Auto! 🏍️  │
└─────────────────────────────────────────┘
```

---

### 🔴 ADMIN DASHBOARD FEATURES

#### 1. **Admin Dashboard Overview**

**Path:** `/admin/dashboard`

```
┌─────────────────────────────────────────────────────────┐
│ 📊 ADMIN DASHBOARD                    [Today: 7 Feb 26] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ━━━━━━━━━━━━ TODAY'S OVERVIEW ━━━━━━━━━━━━━━━         │
│                                                         │
│ ┌────────────┬────────────┬────────────┬────────────┐  │
│ │ 💰 REVENUE │ 📋 BOOKINGS│ 👥 QUEUE   │ 📦 LOW     │  │
│ │ Rp 850K    │ 12 Total   │ 3 Active   │ 8 Items    │  │
│ │ +12% ↑     │ 5 New      │ 2 Waiting  │ ⚠️ Alert   │  │
│ └────────────┴────────────┴────────────┴────────────┘  │
│                                                         │
│ ━━━━━━━━━━━━ QUICK ACTIONS ━━━━━━━━━━━━━━━━           │
│                                                         │
│ [➕ Buat Job Baru] [👥 Tambah Customer]                │
│ [📦 Update Stock]  [👨‍🔧 Manage Teknisi]                │
│                                                         │
│ ━━━━━━━━━━━━ REAL-TIME QUEUE ━━━━━━━━━━━━━━           │
│                                                         │
│ ┌─────────────────────────────────────────────┐        │
│ │ 🔄 IN SERVICE (3)                           │        │
│ ├─────────────────────────────────────────────┤        │
│ │ JOB-001 | B 1234 XYZ | Tune-Up | 70%        │        │
│ │ 👨‍🔧 Andi | Started: 08:15 | ETA: 10:00      │        │
│ │                                             │        │
│ │ JOB-002 | B 5678 ABC | Oil Chg | 40%        │        │
│ │ 👨‍🔧 Budi | Started: 08:30 | ETA: 10:30      │        │
│ │                                             │        │
│ │ JOB-003 | D 9012 DEF | Brake | 20%          │        │
│ │ 👨‍🔧 Candra | Started: 09:00 | ETA: 11:00    │        │
│ └─────────────────────────────────────────────┘        │
│                                                         │
│ ┌─────────────────────────────────────────────┐        │
│ │ ⏳ WAITING (2)                              │        │
│ ├─────────────────────────────────────────────┤        │
│ │ JOB-004 | B 3456 GHI | Electrical           │        │
│ │ 🕐 Waiting since: 09:15                     │        │
│ │ [Assign Technician]                         │        │
│ │                                             │        │
│ │ JOB-005 | B 7890 JKL | Custom               │        │
│ │ 🕐 Waiting since: 09:30                     │        │
│ │ [Assign Technician]                         │        │
│ └─────────────────────────────────────────────┘        │
│                                                         │
│ ━━━━━━━━━━━━ TODAY'S SCHEDULE ━━━━━━━━━━━━━           │
│                                                         │
│ 08:00-10:00: 3 bookings (✅ 2 done, 🔄 1 ongoing)      │
│ 10:00-12:00: 4 bookings (⏳ 2 waiting, 📋 2 scheduled) │
│ 13:00-15:00: 2 bookings (📋 scheduled)                 │
│ 15:00-17:00: 1 booking (📋 scheduled)                  │
│                                                         │
│ [View Full Calendar]                                    │
│                                                         │
│ ━━━━━━━━━━━━ REVENUE CHART ━━━━━━━━━━━━━━━            │
│                                                         │
│ Last 7 Days:                                            │
│ ┌─────────────────────────────────────────────┐        │
│ │  1M │                                    ██  │        │
│ │     │                             ██     ██  │        │
│ │800K │                      ██     ██     ██  │        │
│ │     │              ██      ██     ██     ██  │        │
│ │600K │      ██      ██      ██     ██     ██  │        │
│ │     │  ██  ██  ██  ██  ██  ██  ██ ██     ██  │        │
│ │400K │  ██  ██  ██  ██  ██  ██  ██ ██  ██ ██  │        │
│ │     ├──────────────────────────────────────  │        │
│ │     │ Mon Tue Wed Thu Fri Sat Sun            │        │
│ └─────────────────────────────────────────────┘        │
│                                                         │
│ ━━━━━━━━━━━━ CUSTOMER STATS ━━━━━━━━━━━━━━            │
│                                                         │
│ Total Customers: 128 (+3 new today)                     │
│ Active this month: 45                                   │
│ Retention rate: 68%                                     │
│                                                         │
│ ━━━━━━━━━━━━ TOP SERVICES ━━━━━━━━━━━━━━━             │
│                                                         │
│ 1. Oil Change - 45 bookings this month                  │
│ 2. Basic Tune-Up - 32 bookings                          │
│ 3. Brake Service - 18 bookings                          │
│                                                         │
│ ━━━━━━━━━━━━ TECHNICIAN PERFORMANCE ━━━━━━━━           │
│                                                         │
│ 👨‍🔧 Andi - 156 done | ⭐ 4.8 | 2 active                │
│ 👨‍🔧 Budi - 98 done | ⭐ 4.9 | 1 active                 │
│ 👨‍🔧 Candra - 87 done | ⭐ 4.7 | 1 active               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 2. **Booking Management (Admin)**

**A. Booking Calendar View**
**Path:** `/admin/bookings/calendar`

```
┌─────────────────────────────────────────────────────────┐
│ 📅 BOOKING CALENDAR              [February 2026]        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [< Prev Month]  February 2026  [Next Month >]          │
│                                                         │
│ ┌───┬───┬───┬───┬───┬───┬───┐                          │
│ │Mon│Tue│Wed│Thu│Fri│Sat│Sun│                          │
│ ├───┼───┼───┼───┼───┼───┼───┤                          │
│ │   │   │   │   │   │ 1 │ 2 │                          │
│ │   │   │   │   │   │ 3 │ 1 │                          │
│ ├───┼───┼───┼───┼───┼───┼───┤                          │
│ │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │                          │
│ │ 2 │ 5 │ 8*│ 6 │12*│ 4 │ 1 │                          │
│ ├───┼───┼───┼───┼───┼───┼───┤                          │
│ │10 │11 │12 │13 │14 │15 │16 │                          │
│ │ 4 │ 7 │ 9*│ 5 │ 6 │ 3 │ 2 │                          │
│ └───┴───┴───┴───┴───┴───┴───┘                          │
│                                                         │
│ * = Peak day (>8 bookings)                              │
│                                                         │
│ Selected: Friday, 7 Feb 2026                            │
│                                                         │
│ ━━━━━━━━━━━━ TIME SLOTS ━━━━━━━━━━━━━━━━              │
│                                                         │
│ 08:00-10:00  [▓▓▓░] 3/4 slots                          │
│ ├─ JOB-001 | Andi | Tune-Up | 🔄 In Progress           │
│ ├─ JOB-002 | Budi | Oil Chg | ✅ Completed              │
│ └─ JOB-003 | - | Brake | 📋 Scheduled                   │
│                                                         │
│ 10:00-12:00  [▓▓▓▓] 4/4 FULL                           │
│ ├─ JOB-004 | Candra | Electrical | 📋 Scheduled         │
│ ├─ JOB-005 | Andi | Custom | 📋 Scheduled               │
│ ├─ JOB-006 | Budi | Tune-Up | 📋 Scheduled              │
│ └─ JOB-007 | - | Oil Chg | 📋 Scheduled                 │
│                                                         │
│ 13:00-15:00  [▓▓░░] 2/4 slots                          │
│ ├─ JOB-008 | - | Brake | 📋 Scheduled                   │
│ └─ JOB-009 | Candra | Tune-Up | 📋 Scheduled            │
│                                                         │
│ 15:00-17:00  [▓░░░] 1/4 slots                          │
│ └─ JOB-010 | - | Oil Chg | 📋 Scheduled                 │
│                                                         │
│ [➕ Add Manual Booking]                                 │
└─────────────────────────────────────────────────────────┘
```

**B. Create Manual Booking (Walk-in/Phone)**
**Path:** `/admin/bookings/new`

```
┌─────────────────────────────────────────┐
│ ➕ BUAT JOB BARU (Walk-in/Phone)        │
├─────────────────────────────────────────┤
│                                         │
│ STEP 1: CUSTOMER                        │
│                                         │
│ 🔍 Search Customer:                     │
│ [____________] 🔎                       │
│                                         │
│ Results:                                │
│ ○ Budi Santoso (0812-xxx-7890)          │
│ ○ Budiman (0813-xxx-1234)               │
│                                         │
│ ➕ Or Create New Customer:              │
│ ┌─────────────────────────────┐        │
│ │ Name: [_______________]     │        │
│ │ Phone: [0812________]       │        │
│ │ Email: [_______________]    │        │
│ │ Address: [____________]     │        │
│ │ [Create Customer]           │        │
│ └─────────────────────────────┘        │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                         │
│ STEP 2: VEHICLE                         │
│                                         │
│ Select from Budi's vehicles:            │
│ ○ Yamaha NMAX (B 1234 XYZ)              │
│ ○ Honda Vario (B 5678 ABC)              │
│                                         │
│ ➕ Or Add New Vehicle:                  │
│ ┌─────────────────────────────┐        │
│ │ Brand: [Yamaha ▼]           │        │
│ │ Model: [NMAX___]            │        │
│ │ Plate: [B_1234_XYZ]         │        │
│ │ Year: [2020____]            │        │
│ │ Color: [Hitam___]           │        │
│ │ Mileage: [3500__] km        │        │
│ │ [Add Vehicle]               │        │
│ └─────────────────────────────┘        │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                         │
│ STEP 3: SERVICE DETAILS                 │
│                                         │
│ Service Type: [Basic Tune-Up ▼]        │
│                                         │
│ Keluhan Customer:                       │
│ ┌─────────────────────────────┐        │
│ │ Mesin brebet saat digas...  │        │
│ └─────────────────────────────┘        │
│                                         │
│ Current Mileage: [3500] km              │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                         │
│ STEP 4: SCHEDULE                        │
│                                         │
│ Date: [7 Feb 2026 ▼]                    │
│ (Can select today for walk-in)          │
│                                         │
│ Time Slot:                              │
│ ○ 08:00-10:00 (3/4 slots)               │
│ ● 10:00-12:00 (4/4 FULL)                │
│ ○ 13:00-15:00 (2/4 slots)               │
│ ○ 15:00-17:00 (1/4 slots)               │
│                                         │
│ Priority:                               │
│ ○ Normal   ● Urgent   ○ VIP             │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                         │
│ STEP 5: PRICING (SIMPLIFIED)            │
│                                         │
│ Service Fee: Rp 25.000 (FIXED)          │
│ ℹ️ Admin booking = Rp 25k               │
│                                         │
│ Spare Parts: [➕ Add Parts]             │
│ ┌─────────────────────────────┐        │
│ │ 🔍 Search part...           │        │
│ │                             │        │
│ │ Selected Parts:             │        │
│ │ • Oli Yamalube 1L - 75.000  │        │
│ │   Qty: [1] [×]              │        │
│ │ • Filter Oli - 25.000       │        │
│ │   Qty: [1] [×]              │        │
│ └─────────────────────────────┘        │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│ TOTAL PREVIEW:                          │
│ Service: Rp 25.000                      │
│ Parts: Rp 100.000                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│ TOTAL: Rp 125.000                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                         │
│ STEP 6: ASSIGN TECHNICIAN (Optional)    │
│                                         │
│ ○ Assign Now:                           │
│   [Andi (2 active) ▼]                   │
│ ● Assign Later                          │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                         │
│ [Cancel] [✅ Create Job & Generate QR]  │
└─────────────────────────────────────────┘
```

**Success Screen:**
```
┌─────────────────────────────────────────┐
│ ✅ JOB CREATED SUCCESSFULLY!            │
├─────────────────────────────────────────┤
│                                         │
│ Job Number: JOB-2026-0207-011           │
│ Status: CONFIRMED                       │
│                                         │
│ Customer: Budi Santoso                  │
│ Vehicle: Yamaha NMAX (B 1234 XYZ)       │
│ Service: Basic Tune-Up                  │
│ Scheduled: 7 Feb 2026, 10:00-12:00      │
│                                         │
│ QR Code Generated:                      │
│ ┌─────────────────────────────┐        │
│ │     ██▀▀▀█ █  █ ██▀▀▀█     │        │
│ │     █   █ ▄█▄ █ █   █      │        │
│ │     █▄▄▄█ ███ █ █▄▄▄█      │        │
│ │     (QR Code Image)         │        │
│ └─────────────────────────────┘        │
│                                         │
│ [🖨️ Print QR] [📱 Send to Customer]     │
│ [👁️ View Job] [➕ Create Another]        │
└─────────────────────────────────────────┘
```

#### 3. **Customer Management (CRM)**

**Path:** `/admin/customers`

```
┌─────────────────────────────────────────────────────────┐
│ 👥 CUSTOMER MANAGEMENT                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🔍 Search: [__________] 🔎                              │
│                                                         │
│ Filter:                                                  │
│ Segment: [All ▼] Status: [Active ▼] Sort: [Name ▼]     │
│                                                         │
│ ━━━━━━━━━━━━ CUSTOMER SEGMENTS ━━━━━━━━━━━━━          │
│                                                         │
│ [🆕 New: 15] [🔥 Active: 85] [😴 Dormant: 20]          │
│ [⭐ VIP: 8]                                             │
│                                                         │
│ ━━━━━━━━━━━━ CUSTOMER LIST ━━━━━━━━━━━━━━━            │
│                                                         │
│ ┌─────────────────────────────────────────────┐        │
│ │ ⭐ Budi Santoso                     [VIP]   │        │
│ │ 📞 0812-3456-7890 | 📧 budi@email.com       │        │
│ │                                             │        │
│ │ 🏍️ 2 vehicles | 💰 Total: Rp 1.2M          │        │
│ │ 📋 12 visits | 🎁 850 points                │        │
│ │ Last visit: 5 Feb 2026                      │        │
│ │                                             │        │
│ │ [View Profile] [Book Service] [Message]     │        │
│ └─────────────────────────────────────────────┘        │
│                                                         │
│ ┌─────────────────────────────────────────────┐        │
│ │ 🆕 Siti Aminah                     [NEW]    │        │
│ │ 📞 0813-7890-1234                           │        │
│ │                                             │        │
│ │ 🏍️ 1 vehicle | 💰 Total: Rp 75K            │        │
│ │ 📋 1 visit | 🎁 100 points                  │        │
│ │ Joined: 5 Feb 2026                          │        │
│ │                                             │        │
│ │ [View Profile] [Book Service]               │        │
│ └─────────────────────────────────────────────┘        │
│                                                         │
│ [➕ Add New Customer] [📧 Bulk Message]                 │
│                                                         │
│ Showing 1-20 of 128 customers                           │
│ [1] [2] [3] ... [7] [Next >]                            │
└─────────────────────────────────────────────────────────┘
```

**Customer Profile Detail:**
**Path:** `/admin/customers/[id]`

```
┌─────────────────────────────────────────────────────────┐
│ 👤 Budi Santoso                      [⭐ VIP Customer]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Profile] [Vehicles] [History] [Loyalty] [Invoices]    │
│                                                         │
│ ━━━━━━━━━━━━ PROFILE ━━━━━━━━━━━━━━━━━━━━             │
│                                                         │
│ Name: Budi Santoso                                      │
│ Phone: 0812-3456-7890                                   │
│ Email: budi@email.com                                   │
│ Address: Jl. Merdeka No. 45, Jakarta Selatan            │
│ Customer ID: CUST-001                                   │
│ Joined: 15 Jan 2025                                     │
│ Status: ✅ Active                                       │
│                                                         │
│ ━━━━━━━━━━━━ STATISTICS ━━━━━━━━━━━━━━━━━             │
│                                                         │
│ Total Visits: 12                                        │
│ Total Spent: Rp 1.200.000                               │
│ Average Order: Rp 100.000                               │
│ Last Visit: 5 Feb 2026                                  │
│ Loyalty Points: 850 pts                                 │
│ Free Oil Progress: 3/4 services                         │
│                                                         │
│ ━━━━━━━━━━━━ VEHICLES (2) ━━━━━━━━━━━━━━━             │
│                                                         │
│ 🏍️ Yamaha NMAX (B 1234 XYZ) - 2020                     │
│    Last service: 5 Feb 2026 | 3500 km                   │
│    [View History] [Book Service]                        │
│                                                         │
│ 🏍️ Honda Vario 160 (B 5678 ABC) - 2021                 │
│    Last service: 1 Feb 2026 | 2100 km                   │
│    [View History] [Book Service]                        │
│                                                         │
│ ━━━━━━━━━━━━ RECENT ACTIVITY ━━━━━━━━━━━━             │
│                                                         │
│ • 5 Feb - Completed: Basic Tune-Up - Rp 135K            │
│ • 1 Feb - Completed: Oil Change - Rp 75K                │
│ • 28 Jan - Booked service for 1 Feb                     │
│                                                         │
│ ━━━━━━━━━━━━ ACTIONS ━━━━━━━━━━━━━━━━━━━              │
│                                                         │
│ [✏️ Edit Profile] [📅 Book Service]                     │
│ [🎁 Adjust Points] [📧 Send Message]                    │
│ [🗑️ Deactivate Customer]                                │
└─────────────────────────────────────────────────────────┘
```

**Bulk Notification:**
```
┌─────────────────────────────────────────┐
│ 📧 SEND BULK NOTIFICATION               │
├─────────────────────────────────────────┤
│                                         │
│ Select Recipients:                      │
│ ☑ New Customers (15)                    │
│ ☑ Active Customers (85)                 │
│ ☐ Dormant Customers (20)                │
│ ☑ VIP Customers (8)                     │
│                                         │
│ Total Recipients: 108 customers         │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                         │
│ Message Type:                           │
│ ○ Promo/Offer                           │
│ ○ Reminder                              │
│ ○ Announcement                          │
│                                         │
│ Channel:                                │
│ ☑ Push Notification                     │
│ ☑ Email                                 │
│ ☑ SMS                                   │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                         │
│ Subject:                                │
│ [Promo Spesial Februari!___________]   │
│                                         │
│ Message:                                │
│ ┌─────────────────────────────┐        │
│ │ Dapatkan diskon 20% untuk   │        │
│ │ semua service di bulan Feb! │        │
│ │ Booking sekarang!           │        │
│ └─────────────────────────────┘        │
│                                         │
│ Attach:                                 │
│ ○ Promo Banner                          │
│ ○ Coupon Code                           │
│                                         │
│ Schedule:                               │
│ ○ Send Now                              │
│ ○ Schedule: [Date] [Time]               │
│                                         │
│ [Preview] [Cancel] [📨 Send]            │
└─────────────────────────────────────────┘
```

#### 4. **Loyalty & Rewards Management**

**Path:** `/admin/loyalty`

```
┌─────────────────────────────────────────────────────────┐
│ 🎁 LOYALTY & REWARDS MANAGEMENT                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Settings] [Rewards] [Points History] [Analytics]       │
│                                                         │
│ ━━━━━━━━━━━━ LOYALTY RULES ━━━━━━━━━━━━━━━            │
│                                                         │
│ 🛢️ FREE OIL PROGRAM                                     │
│ ┌─────────────────────────────────────────────┐        │
│ │ Services Required: [4___] services          │        │
│ │ Reward: Free Oil Change (up to Rp 75K)      │        │
│ │ Status: ✅ Active                           │        │
│ │                                             │        │
│ │ Current Stats:                              │        │
│ │ • 28 customers at 3/4 progress              │        │
│ │ • 45 customers claimed this month           │        │
│ │                                             │        │
│ │ [Edit Rules] [View Claims]                  │        │
│ └─────────────────────────────────────────────┘        │
│                                                         │
│ 💎 POINTS SYSTEM                                        │
│ ┌─────────────────────────────────────────────┐        │
│ │ Earn Points:                                │        │
│ │ • Per Service: [100] points                 │        │
│ │ • Per Rp Spent: [1] point per Rp 1.000      │        │
│ │ • Referral: [100] points                    │        │
│ │ • Birthday Bonus: [50] points               │        │
│ │ • Review/Rating: [25] points                │        │
│ │                                             │        │
│ │ [Edit Point Rules]                          │        │
│ └─────────────────────────────────────────────┘        │
│                                                         │
│ 👥 REFERRAL PROGRAM                                     │
│ ┌─────────────────────────────────────────────┐        │
│ │ Referrer gets: [100] points                 │        │
│ │ Referred gets: [100] points                 │        │
│ │                                             │        │
│ │ Total Referrals: 45 this month              │        │
│ │ Conversion Rate: 78%                        │        │
│ │                                             │        │
│ │ [Edit Referral Rewards]                     │        │
│ └─────────────────────────────────────────────┘        │
│                                                         │
│ ━━━━━━━━━━━━ REWARD CATALOG ━━━━━━━━━━━━━━            │
│                                                         │
│ [➕ Add New Reward]                                     │
│                                                         │
│ ┌─────────────────────────────────────────────┐        │
│ │ 🛢️ Free Oli Yamalube             [ACTIVE]  │        │
│ │ Cost: 500 points                            │        │
│ │ Redeemed: 23 times this month               │        │
│ │ Stock: Unlimited                            │        │
│ │ [Edit] [Deactivate]                         │        │
│ └─────────────────────────────────────────────┘        │
│                                                         │
│ ┌─────────────────────────────────────────────┐        │
│ │ 🧽 Free Car Wash                 [ACTIVE]   │        │
│ │ Cost: 300 points                            │        │
│ │ Redeemed: 15 times this month               │        │
│ │ Stock: Unlimited                            │        │
│ │ [Edit] [Deactivate]                         │        │
│ └─────────────────────────────────────────────┘        │
│                                                         │
│ ┌─────────────────────────────────────────────┐        │
│ │ 💰 Diskon Rp 50.000              [ACTIVE]   │        │
│ │ Cost: 1000 points                           │        │
│ │ Redeemed: 8 times this month                │        │
│ │ Stock: Unlimited                            │        │
│ │ [Edit] [Deactivate]                         │        │
│ └─────────────────────────────────────────────┘        │
│                                                         │
│ ━━━━━━━━━━━━ MANUAL ADJUSTMENTS ━━━━━━━━━━            │
│                                                         │
│ Customer: [Search customer...] 🔎                       │
│                                                         │
│ Selected: Budi Santoso (850 pts)                        │
│                                                         │
│ Action:                                                 │
│ ○ Add Points   ○ Deduct Points   ○ Reset Counter       │
│                                                         │
│ Amount: [___] points                                    │
│                                                         │
│ Reason:                                                 │
│ ┌─────────────────────────────────────────────┐        │
│ │ Kompensasi komplain service...              │        │
│ └─────────────────────────────────────────────┘        │
│                                                         │
│ [Cancel] [✅ Apply Adjustment]                          │
└─────────────────────────────────────────────────────────┘
```

#### 5. **Chatbot Management**

**Path:** `/admin/chatbot`

```
┌─────────────────────────────────────────────────────────┐
│ 🤖 WANDA AI CHATBOT MANAGEMENT                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Analytics] [Intents] [Responses] [Training] [Logs]     │
│                                                         │
│ ━━━━━━━━━━━━ CHATBOT ANALYTICS ━━━━━━━━━━━━           │
│                                                         │
│ ┌────────────┬────────────┬────────────┬────────────┐  │
│ │ 💬 TOTAL   │ ✅ RESOLVED│ 🤝 HANDOVER│ 📊 AVG     │  │
│ │ 1,245      │ 892 (72%)  │ 353 (28%)  │ 4.2/5.0    │  │
│ │ chats      │            │            │ rating     │  │
│ └────────────┴────────────┴────────────┴────────────┘  │
│                                                         │
│ ━━━━━━━━━━━━ TOP INTENTS (This Month) ━━━━━━          │
│                                                         │
│ 1. book_service - 456 queries (95% success)             │
│ 2. check_status - 234 queries (98% success)             │
│ 3. price_inquiry - 189 queries (91% success)            │
│ 4. loyalty_points - 156 queries (99% success)           │
│ 5. location - 98 queries (100% success)                 │
│                                                         │
│ ━━━━━━━━━━━━ INTENTS MANAGEMENT ━━━━━━━━━━            │
│                                                         │
│ [➕ Add New Intent]                                     │
│                                                         │
│ ┌─────────────────────────────────────────────┐        │
│ │ Intent: book_service            [ACTIVE]    │        │
│ │ Confidence: 95%                             │        │
│ │ Training Phrases: 127                       │        │
│ │                                             │        │
│ │ Sample Phrases:                             │        │
│ │ • "Mau booking servis besok"                │        │
│ │ • "Book tune up untuk NMAX"                 │        │
│ │ • "Jadwalin service minggu depan"           │        │
│ │                                             │        │
│ │ [Edit] [Add Training Data] [Test]           │        │
│ └─────────────────────────────────────────────┘        │
│                                                         │
│ ┌─────────────────────────────────────────────┐        │
│ │ Intent: check_status            [ACTIVE]    │        │
│ │ Confidence: 98%                             │        │
│ │ Training Phrases: 89                        │        │
│ │                                             │        │
│ │ [Edit] [Add Training Data] [Test]           │        │
│ └─────────────────────────────────────────────┘        │
│                                                         │
│ ━━━━━━━━━━━━ RESPONSE EDITOR ━━━━━━━━━━━━━           │
│                                                         │
│ Select Intent: [book_service ▼]                         │
│                                                         │
│ Response Template:                                      │
│ ┌─────────────────────────────────────────────┐        │
│ │ Halo! Saya bantu booking ya 😊              │        │
│ │                                             │        │
│ │ Untuk kendaraan apa?                        │        │
│ │ {{#each vehicles}}                          │        │
│ │ {{index}}. {{brand}} {{model}} ({{plate}})  │        │
│ │ {{/each}}                                   │        │
│ └─────────────────────────────────────────────┘        │
│                                                         │
│ Variables Available:                                    │
│ • {{customer_name}}                                     │
│ • {{vehicles}}                                          │
│ • {{loyalty_points}}                                    │
│                                                         │
│ [Save Response] [Test Response]                         │
│                                                         │
│ ━━━━━━━━━━━━ FALLBACK LOGS ━━━━━━━━━━━━━━            │
│                                                         │
│ Unrecognized queries (< 80% confidence):                │
│                                                         │
│ • "Bisa kredit gak?" - 3 times                          │
│   [Create Intent] [Add to FAQ]                          │
│                                                         │
│ • "Terima motor bekas?" - 2 times                       │
│   [Create Intent] [Add to FAQ]                          │
│                                                         │
│ ━━━━━━━━━━━━ HUMAN HANDOVER ━━━━━━━━━━━━━            │
│                                                         │
│ Active Chats: 2                                         │
│                                                         │
│ ┌─────────────────────────────────────────────┐        │
│ │ 👤 Siti Aminah                              │        │
│ │ "Saya mau komplain, motor saya masih        │        │
│ │  bermasalah setelah service kemarin!"       │        │
│ │                                             │        │
│ │ Sentiment: 😠 Negative (85%)                │        │
│ │ [Take Over Chat]                            │        │
│ └─────────────────────────────────────────────┘        │
│                                                         │
│ [View All Handover Requests]                            │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ DATABASE SCHEMA

### Supabase KV Store Structure

**Main Table:** `kv_store_c1ef5280`

```sql
CREATE TABLE kv_store_c1ef5280 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_key_prefix ON kv_store_c1ef5280(key text_pattern_ops);
CREATE INDEX idx_updated_at ON kv_store_c1ef5280(updated_at DESC);
```

### Data Models (by Prefix)

#### 1. **Users** (`user_`)
```typescript
interface User {
  id: string;                    // "user_001"
  auth_id?: string;              // Supabase Auth UUID
  
  role: 'customer' | 'admin';
  
  // Personal Info
  name: string;
  email: string;
  phone: string;
  address?: string;
  
  // Profile
  avatar_url?: string;
  date_of_birth?: string;
  
  // Stats (customer only)
  total_visits?: number;
  total_spent?: number;
  last_visit?: string;
  
  // Metadata
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}
```

#### 2. **Vehicles** (`vehicle_`)
```typescript
interface Vehicle {
  id: string;                    // "vehicle_001"
  user_id: string;               // Owner reference
  
  // Vehicle Info
  brand: string;                 // "Yamaha", "Honda", "Suzuki"
  model: string;                 // "NMAX", "PCX", "Vario"
  plate_number: string;          // "B 1234 XYZ" (unique)
  year?: number;
  color?: string;
  engine_capacity?: string;      // "155cc"
  vin?: string;                  // Vehicle Identification Number
  
  // Service Info
  current_mileage: number;       // Current km
  last_service_date?: string;
  last_service_km?: number;
  next_service_due_km?: number;  // For smart reminders
  
  // Photos
  photo_url?: string;
  
  // Metadata
  status: 'active' | 'sold' | 'inactive';
  created_at: string;
  updated_at: string;
}
```

#### 3. **Bookings** (`booking_`)
```typescript
interface Booking {
  id: string;                    // "booking_20260207001"
  job_number: string;            // "JOB-2026-0207-001" (display)
  
  // References
  user_id: string;
  vehicle_id: string;
  technician_id?: string;
  
  // Customer Info (denormalized for quick access)
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  
  // Vehicle Info (denormalized)
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_plate: string;
  vehicle_mileage: number;       // Mileage at booking
  
  // Service Details
  service_type: string;          // "Oil Change", "Basic Tune-Up", etc.
  complaints?: string;           // Customer's description
  
  // Scheduling
  scheduled_date: string;        // "2026-02-07"
  scheduled_time_slot: string;   // "08:00-10:00"
  
  // Status Flow
  status: 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'quality_check' | 'completed' | 'cancelled';
  
  // QR Code
  qr_code: string;               // Unique token
  qr_used: boolean;              // Check-in status
  qr_used_at?: string;
  
  // Pricing
  service_fee: number;           // 0 for customer, 25000 for admin
  spare_parts: SparePartItem[];
  total_amount: number;
  
  // Progress
  progress_percentage: number;   // 0-100
  current_step?: string;         // "Checking engine", "Replacing parts"
  estimated_completion?: string;
  
  // Assignment
  technician_id?: string;
  technician_name?: string;
  assigned_at?: string;
  started_at?: string;
  completed_at?: string;
  
  // Notes
  customer_notes?: string;       // From customer
  technician_notes?: string;     // Findings & work done
  recommendations?: string;      // Future service recommendations
  admin_notes?: string;
  
  // Timestamps
  booking_source: 'customer' | 'admin';  // Track origin
  created_by: string;            // user_id or admin_id
  created_at: string;
  updated_at: string;
  cancelled_at?: string;
  cancellation_reason?: string;
}

interface SparePartItem {
  part_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}
```

#### 4. **Spare Parts** (`sparepart_`)
```typescript
interface SparePart {
  id: string;                    // "sparepart_001"
  sku?: string;                  // "SP-OIL-YAMALUBE-1L"
  
  // Product Info
  name: string;                  // "Oli Yamalube 10W-40 1L"
  category: string;              // "Oil", "Battery", "Brake", "Filter", "Tire", etc.
  brand?: string;
  description?: string;
  
  // Inventory
  stock: number;
  min_stock: number;             // Alert threshold
  unit: string;                  // "pcs", "liter", "set"
  
  // Pricing
  purchase_price: number;
  selling_price: number;
  margin: number;                // Auto-calculated
  
  // Supplier
  supplier_name?: string;
  supplier_contact?: string;
  
  // Metadata
  status: 'available' | 'out_of_stock' | 'discontinued';
  last_restock_date?: string;
  created_at: string;
  updated_at: string;
}
```

#### 5. **Technicians** (`technician_`)
```typescript
interface Technician {
  id: string;                    // "technician_001"
  
  // Personal
  name: string;
  phone: string;
  email?: string;
  photo_url?: string;
  
  // Professional
  specialization: string;        // "Engine", "Electrical", "General", "Transmission"
  experience_years?: number;
  certifications?: string[];
  
  // Performance
  rating: number;                // 1-5
  total_jobs_completed: number;
  active_jobs: number;           // Current workload
  completed_jobs: number;
  
  // Schedule
  working_days: string[];        // ["monday", "tuesday", "wednesday", ...]
  working_hours: {
    start: string;               // "08:00"
    end: string;                 // "17:00"
  };
  
  // Metadata
  status: 'active' | 'inactive' | 'on_leave';
  hire_date?: string;
  created_at: string;
  updated_at: string;
}
```

#### 6. **Loyalty Counters** (`loyalty_counter_`)
```typescript
interface LoyaltyCounter {
  id: string;                    // "loyalty_counter_user001_vehicle001"
  user_id: string;
  vehicle_id: string;
  
  // Free Oil Progress
  service_count: number;         // Current count (0-4)
  target_count: number;          // Default: 4
  free_oil_earned: boolean;
  last_service_date?: string;
  last_reset_date?: string;      // When counter was reset after claim
  
  // History
  total_free_oils_claimed: number;
  
  // Metadata
  created_at: string;
  updated_at: string;
}
```

#### 7. **Loyalty Points** (`loyalty_points_`)
```typescript
interface LoyaltyPointsAccount {
  id: string;                    // "loyalty_points_user001"
  user_id: string;
  
  // Points
  total_points: number;
  pending_points: number;
  
  // Referral
  referral_code: string;         // "BUDI2026"
  referred_by?: string;          // Referrer's user_id
  total_referrals: number;
  
  // Metadata
  created_at: string;
  updated_at: string;
}
```

#### 8. **Points Transactions** (`points_tx_`)
```typescript
interface PointsTransaction {
  id: string;                    // "points_tx_001"
  user_id: string;
  
  type: 'earn' | 'redeem';
  amount: number;                // Positive for earn, negative for redeem
  
  source: 'service' | 'referral' | 'birthday' | 'review' | 'manual';
  source_id?: string;            // booking_id, referral_id, etc.
  
  description: string;
  
  // Admin adjustment
  adjusted_by?: string;          // admin_id
  adjustment_reason?: string;
  
  created_at: string;
}
```

#### 9. **Rewards** (`reward_`)
```typescript
interface Reward {
  id: string;                    // "reward_001"
  
  name: string;                  // "Free Oli Yamalube"
  description?: string;
  category: 'service' | 'discount' | 'product';
  
  // Cost
  points_required: number;
  
  // Value
  value: number;                 // Actual value in Rupiah
  discount_amount?: number;      // If type is discount
  
  // Availability
  stock?: number;                // null = unlimited
  
  // Images
  image_url?: string;
  
  // Metadata
  status: 'active' | 'inactive';
  total_redeemed: number;
  created_at: string;
  updated_at: string;
}
```

#### 10. **Reward Redemptions** (`redemption_`)
```typescript
interface RewardRedemption {
  id: string;                    // "redemption_001"
  
  user_id: string;
  reward_id: string;
  
  points_spent: number;
  
  // Usage
  redeemed_at: string;
  used: boolean;
  used_at?: string;
  booking_id?: string;           // If used in a booking
  
  // Metadata
  status: 'active' | 'used' | 'expired';
  expires_at?: string;
  created_at: string;
}
```

#### 11. **Chat Logs** (`chat_`)
```typescript
interface ChatMessage {
  id: string;                    // "chat_001"
  
  user_id: string;
  session_id: string;            // Group messages by session
  
  // Message
  message: string;
  is_bot: boolean;               // true = Wanda AI, false = User
  
  // AI Processing
  intent?: string;               // Detected intent
  confidence_score?: number;     // 0-1
  entities?: Record<string, any>; // Extracted entities
  
  // Sentiment
  sentiment?: 'positive' | 'neutral' | 'negative';
  sentiment_score?: number;
  
  // Handover
  requires_human: boolean;
  handed_over: boolean;
  handled_by?: string;           // admin_id if handed over
  
  created_at: string;
}
```

#### 12. **Notifications** (`notification_`)
```typescript
interface Notification {
  id: string;                    // "notification_001"
  
  user_id: string;
  
  type: 'booking' | 'reminder' | 'promo' | 'loyalty' | 'system';
  
  title: string;
  message: string;
  
  // Action
  action_url?: string;           // Deep link
  action_label?: string;         // "View Booking", "Book Now"
  
  // Metadata
  is_read: boolean;
  read_at?: string;
  
  // Scheduling
  scheduled_for?: string;        // For future notifications
  sent: boolean;
  sent_at?: string;
  
  created_at: string;
}
```

#### 13. **Analytics** (`analytics_daily_`)
```typescript
interface DailyAnalytics {
  id: string;                    // "analytics_daily_20260207"
  date: string;                  // "2026-02-07"
  
  // Revenue
  total_revenue: number;
  service_revenue: number;       // From service fees
  parts_revenue: number;         // From spare parts
  
  // Bookings
  total_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  no_show: number;
  
  // Customers
  new_customers: number;
  returning_customers: number;
  total_customers_served: number;
  
  // Services
  services_by_type: Record<string, number>;
  avg_service_time: number;      // in minutes
  
  // Parts
  parts_sold: number;
  low_stock_alerts: number;
  
  // Loyalty
  points_earned: number;
  points_redeemed: number;
  free_oils_claimed: number;
  
  // Chatbot
  chatbot_queries: number;
  chatbot_resolved: number;
  human_handovers: number;
  
  created_at: string;
  updated_at: string;
}
```

---

## 🎨 UI/UX DESIGN SYSTEM

### Color Palette
```css
/* Primary Colors */
--color-primary: #FF6B00;          /* Orange */
--color-primary-light: #FF8534;
--color-primary-dark: #CC5600;

/* Secondary Colors */
--color-secondary: #2563EB;        /* Blue */
--color-secondary-light: #3B82F6;
--color-secondary-dark: #1E40AF;

/* Status Colors */
--color-success: #10B981;          /* Green */
--color-warning: #F59E0B;          /* Yellow */
--color-danger: #EF4444;           /* Red */
--color-info: #3B82F6;             /* Blue */

/* Neutral Colors */
--color-gray-900: #111827;         /* Text primary */
--color-gray-600: #4B5563;         /* Text secondary */
--color-gray-400: #9CA3AF;         /* Disabled */
--color-gray-200: #E5E7EB;         /* Borders */
--color-gray-100: #F3F4F6;         /* Background */
--color-gray-50: #F9FAFB;          /* Light background */
--color-white: #FFFFFF;

/* Loyalty/Rewards */
--color-gold: #F59E0B;
--color-vip: #8B5CF6;              /* Purple for VIP */
```

### Typography
```css
/* Font Family */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
             'Helvetica Neue', sans-serif;

/* Font Sizes (Tailwind scale) */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing
```css
/* Tailwind spacing scale */
--spacing-1: 0.25rem;    /* 4px */
--spacing-2: 0.5rem;     /* 8px */
--spacing-3: 0.75rem;    /* 12px */
--spacing-4: 1rem;       /* 16px */
--spacing-5: 1.25rem;    /* 20px */
--spacing-6: 1.5rem;     /* 24px */
--spacing-8: 2rem;       /* 32px */
--spacing-10: 2.5rem;    /* 40px */
--spacing-12: 3rem;      /* 48px */
```

### Border Radius
```css
--rounded-sm: 0.125rem;  /* 2px */
--rounded: 0.25rem;      /* 4px */
--rounded-md: 0.375rem;  /* 6px */
--rounded-lg: 0.5rem;    /* 8px */
--rounded-xl: 0.75rem;   /* 12px */
--rounded-2xl: 1rem;     /* 16px */
--rounded-full: 9999px;
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

---

## 📐 BUSINESS RULES

### Pricing Rules
1. **Customer Online Booking:**
   - Service Fee = **Rp 0** (FREE - Online Booking Promo)
   - Spare parts = Market price
   - Total = Spare parts only

2. **Admin Booking (Walk-in/Phone):**
   - Service Fee = **Rp 25.000** (FIXED)
   - Spare parts = Market price
   - Total = Rp 25.000 + Spare parts

3. **Loyalty Redemption:**
   - Can use points for discounts
   - Free oil voucher can replace oli cost (up to Rp 75.000)

### Status Flow
```
Customer Booking:
pending → confirmed → checked_in → in_progress → quality_check → completed
   ↓          ↓            ↓            ↓              ↓
cancelled  cancelled    cancelled   cancelled     cancelled

Admin Booking:
confirmed → checked_in → in_progress → quality_check → completed
    ↓           ↓            ↓              ↓
cancelled   cancelled    cancelled      cancelled
```

### QR Code Rules
1. **Generation:**
   - Unique token generated at booking
   - QR code image stored in Supabase Storage
   - Can be downloaded/printed

2. **Usage:**
   - Can only be scanned once
   - Must be scanned at workshop location (GPS verification - future)
   - Updates status to `checked_in`
   - Triggers notification to assign technician

3. **Expiry:**
   - QR valid only on scheduled date
   - Expired QR shows error with reschedule option

### Loyalty Rules
1. **Free Oil Program:**
   - Counter per vehicle (not per customer)
   - Every 4 services = 1 free oil change
   - Max value: Rp 75.000
   - Auto-reset after claim

2. **Points System:**
   - Earn: 100 pts per service
   - Earn: 1 pt per Rp 1.000 spent
   - Earn: 100 pts per successful referral
   - Earn: 50 pts on birthday month
   - Earn: 25 pts for rating/review

3. **Referral:**
   - Both parties get 100 pts
   - Referral must complete first service
   - Max 10 referrals per month per user

### Scheduling Rules
1. **Time Slots:**
   - 08:00-10:00
   - 10:00-12:00
   - 13:00-15:00
   - 15:00-17:00

2. **Capacity:**
   - Max 4 bookings per slot
   - Admin can override (for VIP/urgent)

3. **Booking Window:**
   - Customer: Next day onwards (cannot book same day)
   - Admin: Can book same day (walk-in)
   - Max advance: 30 days

4. **Reminders:**
   - 1 day before: Email + Push
   - 1 hour before: SMS + Push
   - 30 min before: Push only

### Smart Service Reminders
```javascript
// Trigger conditions:
if (last_service_date > 90 days) {
  send_reminder("Time-based: 3 months since last service")
}

if (current_mileage - last_service_km > 3000) {
  send_reminder("Mileage-based: 3000 km exceeded")
}

// Notification frequency:
// 1st reminder: 7 days after trigger
// 2nd reminder: 14 days after 1st
// 3rd reminder: 21 days after 2nd
// Then: monthly reminders
```

---

## 🔌 API ENDPOINTS

### Base URL
```
https://tvugghippwvoxsjqyxkr.supabase.co/functions/v1/make-server-c1ef5280
```

### Authentication
```typescript
Headers: {
  'Authorization': `Bearer ${publicAnonKey}`,
  'Content-Type': 'application/json'
}
```

### Endpoints

#### Authentication
```
POST   /auth/register          - Register new user
POST   /auth/login             - Login
POST   /auth/logout            - Logout
POST   /auth/refresh           - Refresh token
GET    /auth/me                - Get current user
PUT    /auth/me                - Update profile
```

#### Bookings
```
GET    /bookings               - List all (admin) or own (customer)
  ?status=pending
  ?date=2026-02-07
  &user_id=xxx (admin only)

GET    /bookings/:id           - Get detail
POST   /bookings               - Create booking
PUT    /bookings/:id           - Update booking
DELETE /bookings/:id           - Cancel booking

POST   /bookings/:id/check-in  - QR check-in
PUT    /bookings/:id/assign    - Assign technician
PUT    /bookings/:id/status    - Update status
PUT    /bookings/:id/progress  - Update progress %
POST   /bookings/:id/parts     - Add spare parts
```

#### Customers (Admin only)
```
GET    /customers              - List all
GET    /customers/:id          - Get detail
POST   /customers              - Create customer
PUT    /customers/:id          - Update customer
DELETE /customers/:id          - Soft delete

GET    /customers/search       - Search by name/phone/vehicle
  ?q=Budi

GET    /customers/segments     - Get segments (new, active, dormant, VIP)
POST   /customers/bulk-notify  - Send bulk notification
```

#### Vehicles
```
GET    /vehicles               - List all or by user
  ?user_id=xxx
  
GET    /vehicles/:id           - Get detail
POST   /vehicles               - Create vehicle
PUT    /vehicles/:id           - Update vehicle
DELETE /vehicles/:id           - Soft delete

GET    /vehicles/:id/history   - Service history
GET    /vehicles/:id/reminders - Get due service reminders
```

#### Spare Parts
```
GET    /parts                  - List all
  ?category=Oil
  &status=available
  &low_stock=true
  
GET    /parts/:id              - Get detail
POST   /parts                  - Create part (admin)
PUT    /parts/:id              - Update part (admin)
DELETE /parts/:id              - Soft delete (admin)

PUT    /parts/:id/stock        - Update stock
  Body: { quantity: 10, type: 'add'|'subtract', reason: '...' }
```

#### Technicians (Admin only)
```
GET    /technicians            - List all
  ?status=active
  
GET    /technicians/:id        - Get detail
POST   /technicians            - Create technician
PUT    /technicians/:id        - Update technician
DELETE /technicians/:id        - Soft delete

GET    /technicians/available  - Get available now
  ?date=2026-02-07
  &time_slot=08:00-10:00
  
GET    /technicians/:id/jobs   - Get assigned jobs
GET    /technicians/:id/performance - Performance metrics
```

#### Loyalty
```
GET    /loyalty/me             - Get my loyalty data
GET    /loyalty/counters/:vehicle_id - Get free oil counter
POST   /loyalty/claim-free-oil - Claim free oil reward
  Body: { vehicle_id, booking_id }

GET    /loyalty/points         - Get points balance
GET    /loyalty/points/history - Points transaction history
POST   /loyalty/points/redeem  - Redeem reward
  Body: { reward_id }

GET    /loyalty/rewards        - List available rewards
GET    /loyalty/referral       - Get referral code & stats
POST   /loyalty/referral/apply - Apply referral code
  Body: { referral_code }

# Admin only:
PUT    /loyalty/points/adjust  - Manual adjustment
  Body: { user_id, amount, reason }
```

#### Chatbot
```
POST   /chat/message           - Send message to Wanda AI
  Body: { user_id, session_id, message }
  Response: { reply, intent, confidence, actions }

GET    /chat/history/:session_id - Get chat history
POST   /chat/handover          - Request human agent
  Body: { session_id, reason }

# Admin only:
GET    /chat/intents           - List all intents
PUT    /chat/intents/:id       - Update intent
POST   /chat/train             - Train with new data
GET    /chat/fallbacks         - Get fallback logs
GET    /chat/handover/pending  - Get pending handover requests
```

#### QR Code
```
POST   /qr/generate            - Generate QR for booking
  Body: { booking_id }
  Response: { qr_code_url, qr_token }

POST   /qr/verify              - Verify & check-in
  Body: { qr_token, location? }
  Response: { valid, booking, message }
```

#### Notifications
```
GET    /notifications          - List my notifications
  ?is_read=false
  
PUT    /notifications/:id/read - Mark as read
PUT    /notifications/read-all - Mark all as read
POST   /notifications/send     - Send notification (admin)
  Body: { user_id(s), type, title, message, action_url }
```

#### Analytics (Admin only)
```
GET    /analytics/dashboard    - Dashboard stats
  ?date=2026-02-07
  
GET    /analytics/revenue      - Revenue reports
  ?period=daily|weekly|monthly
  &start=2026-02-01
  &end=2026-02-07

GET    /analytics/bookings     - Booking reports
GET    /analytics/customers    - Customer analytics
  - Retention rate
  - Churn rate
  - Acquisition
  - Segmentation

GET    /analytics/services     - Service performance
  - Most popular
  - Average time
  - Completion rate

GET    /analytics/loyalty      - Loyalty program analytics
  - Redemption rate
  - Popular rewards
  - Referral performance

GET    /analytics/chatbot      - Chatbot analytics
  - Query volume
  - Resolution rate
  - Top intents
  - Handover rate

GET    /analytics/technicians  - Technician performance
  - Jobs completed
  - Average rating
  - Efficiency

POST   /analytics/export       - Export report
  Body: { type, format: 'excel'|'pdf', filters }
```

---

## 🔒 SECURITY & AUTHENTICATION

### Authentication Flow
```
1. User Registration:
   - Create account (email/password or social)
   - Email verification
   - Create profile
   - Generate referral code

2. User Login:
   - Authenticate with Supabase Auth
   - Receive JWT token
   - Store token in local storage/cookies
   - Fetch user profile

3. Token Refresh:
   - Auto-refresh before expiry
   - Handle refresh token rotation

4. Logout:
   - Clear local tokens
   - Revoke session server-side
```

### Authorization
```typescript
// Middleware example
async function authorize(req, allowedRoles: string[]) {
  const token = req.headers.authorization?.split(' ')[1];
  const { user } = await supabase.auth.getUser(token);
  
  if (!user) throw new Error('Unauthorized');
  
  const profile = await getUser Profile(user.id);
  if (!allowedRoles.includes(profile.role)) {
    throw new Error('Forbidden');
  }
  
  return { user, profile };
}

// Usage:
router.get('/admin/customers', async (req, res) => {
  await authorize(req, ['admin']); // Only admin can access
  // ... handler code
});
```

### Data Privacy
- ✅ Customer data isolated by user_id
- ✅ Row-level security (RLS) in Supabase
- ✅ Encrypted sensitive fields (phone, email)
- ✅ GDPR compliance (export/delete data)
- ✅ Audit logs for admin actions

### API Security
```typescript
// Rate limiting
const rateLimit = {
  '/auth/login': '5 per 15 minutes',
  '/chat/message': '30 per minute',
  '/bookings': '10 per minute',
  default: '100 per minute'
}

// CORS
const corsOptions = {
  origin: ['https://sunest-auto.com', 'https://admin.sunest-auto.com'],
  credentials: true
}

// Input validation
const validateBooking = (data) => {
  // Joi/Zod schema validation
  // Sanitize inputs
  // Check SQL injection, XSS
}
```

---

## 📊 SUCCESS METRICS (KPIs)

### Business Metrics
```
Revenue:
├─ Monthly Revenue Target: Rp 50M
├─ Average Order Value: Rp 150K
├─ Revenue Growth: +15% MoM
└─ Service Fee vs Parts: 12% / 88%

Customer:
├─ Total Customers: 500+
├─ Monthly Active Users: 200+
├─ New Customer Acquisition: 20/month
├─ Customer Retention: 70%+
├─ Churn Rate: < 10%
└─ Average Visits per Customer: 3/year

Bookings:
├─ Total Bookings/Month: 300+
├─ Online Booking %: 60%+
├─ Completion Rate: 95%+
├─ No-show Rate: < 5%
└─ Average Service Time: 45 min

Loyalty:
├─ Loyalty Program Enrollment: 80%+
├─ Free Oil Claim Rate: 40%/month
├─ Points Redemption: 50%/month
├─ Referral Conversion: 70%+
└─ Average Points per Customer: 500
```

### Operational Metrics
```
Efficiency:
├─ Technician Utilization: 85%+
├─ Average Queue Time: < 15 min
├─ Service Completion On-time: 90%+
└─ Parts Inventory Turnover: 12x/year

Quality:
├─ Customer Satisfaction: 4.5/5.0
├─ Technician Rating: 4.7/5.0
├─ Complaint Rate: < 2%
└─ Return Visit Rate: 65%+
```

### Technical Metrics
```
Performance:
├─ Page Load Time: < 2s
├─ API Response Time: < 300ms
├─ Real-time Update Latency: < 500ms
└─ Uptime: 99.9%+

AI Chatbot:
├─ Resolution Rate: 75%+
├─ Intent Recognition Accuracy: 95%+
├─ Human Handover Rate: < 25%
├─ Average Session Duration: 3 min
└─ Customer Satisfaction: 4.3/5.0

Mobile:
├─ QR Check-in Usage: 90%+
├─ Mobile App Rating: 4.6/5.0
├─ Push Notification Open Rate: 40%+
└─ App Crash Rate: < 0.1%
```

---

## 🚀 IMPLEMENTATION ROADMAP

### **PHASE 1: MVP (Month 1-2)** ✅ Current Focus
```
Core Features:
✅ User registration & authentication
✅ Customer dashboard
✅ Online booking system
✅ Admin dashboard
✅ Booking management (calendar, manual booking)
✅ Basic CRM (customer & vehicle management)
✅ Inventory management
✅ Technician management
✅ Real-time job tracking
✅ Simple invoicing
✅ Basic analytics

Tech:
✅ Next.js frontend
✅ Supabase backend
✅ Tailwind CSS + Shadcn UI
✅ Basic real-time updates
```

### **PHASE 2: Loyalty & QR (Month 3)**
```
Features:
⏳ QR code generation & scanning
⏳ QR check-in system
⏳ Loyalty program (free oil counter)
⏳ Points system
⏳ Referral program
⏳ Rewards catalog
⏳ Smart service reminders (time & km based)

Tech:
⏳ QR code library
⏳ Notification system (email/SMS/push)
⏳ Background jobs for reminders
```

### **PHASE 3: AI Chatbot (Month 4)**
```
Features:
⏳ Wanda AI chatbot
⏳ Indonesian NLP
⏳ Intent recognition
⏳ Booking via chat
⏳ Status checking via chat
⏳ FAQ automation
⏳ Human handover
⏳ Chatbot analytics

Tech:
⏳ Dialogflow / Rasa integration
⏳ NLP training
⏳ Sentiment analysis
⏳ Websocket for real-time chat
```

### **PHASE 4: Self-Service & Advanced Features (Month 5)**
```
Features:
⏳ Help Center / FAQ
⏳ Service cost calculator
⏳ Digital manual books
⏳ Troubleshooting guides
⏳ Video tutorials
⏳ Before/after service photos
⏳ PDF invoice generation
⏳ Advanced analytics & reports
⏳ Export to Excel/PDF

Tech:
⏳ Content management
⏳ PDF generation
⏳ Image optimization & storage
⏳ Advanced charts (Recharts)
```

### **PHASE 5: Mobile App (Month 6-7)**
```
Features:
⏳ Native mobile app (React Native)
⏳ Offline mode
⏳ GPS location for check-in
⏳ Push notifications
⏳ Camera for vehicle photos
⏳ Better QR scanner

Tech:
⏳ React Native
⏳ Expo
⏳ Native modules
```

### **PHASE 6: Advanced AI & Automation (Month 8+)**
```
Features:
⏳ Predictive maintenance AI
⏳ Smart scheduling (AI-powered slot optimization)
⏳ Automatic parts suggestion
⏳ Voice assistant
⏳ Computer vision (damage detection from photos)
⏳ Dynamic pricing
⏳ Multi-location support

Tech:
⏳ TensorFlow.js
⏳ ML model training
⏳ Computer vision APIs
⏳ Voice recognition
```

### **FUTURE ENHANCEMENTS**
```
Business:
⏳ Online payment (Midtrans/Xendit)
⏳ E-commerce (spare parts marketplace)
⏳ B2B corporate accounts
⏳ Franchise management
⏳ Multi-language support

Technical:
⏳ Microservices architecture
⏳ Kubernetes deployment
⏳ Advanced caching (Redis)
⏳ GraphQL API
⏳ Real-time collaboration
```

---

## 🎯 CONCLUSION

Sunest Auto adalah platform komprehensif yang menggabungkan **teknologi AI, automation, dan user experience terbaik** untuk mentransformasi bisnis bengkel motor tradisional menjadi **digital-first smart workshop**.

### Key Differentiators:
1. **🤖 AI-Powered**: Wanda chatbot untuk customer service 24/7
2. **🎁 Loyalty Program**: Free oil program & points system untuk retention
3. **📱 Smart Technology**: QR check-in, real-time tracking
4. **📊 Data-Driven**: Analytics untuk business intelligence
5. **🔄 Automation**: Smart reminders, predictive scheduling

### Expected Impact:
- ✅ **Customer Satisfaction**: 4.5/5.0 rating
- ✅ **Retention Rate**: 70%+ (vs industry avg 40%)
- ✅ **Revenue Growth**: +30% dalam 6 bulan
- ✅ **Operational Efficiency**: -40% admin workload
- ✅ **Online Booking**: 60% dari total bookings

---

**Document Version:** 2.0  
**Last Updated:** February 7, 2026  
**Status:** Ready for Implementation 🚀

---

*"Revolutionizing motorcycle workshop industry with AI, automation, and customer-first approach."* 🏍️✨
