# 🏍️ SUNEST AUTO - Digital Workshop Management System

Platform digital komprehensif untuk bengkel motor modern dengan fitur AI Chatbot, Loyalty Program, QR Check-in, dan Real-time Tracking.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running Locally](#-running-locally)
- [Project Structure](#-project-structure)
- [Database Setup](#-database-setup)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### For Customers (Users)
- 📱 **Online Booking** - Book service dengan promo GRATIS biaya jasa (Rp 0)
- 📍 **Real-time Tracking** - Track progress servis secara real-time
- 🎁 **Loyalty Program** - Free oil setiap 4x service + points system
- 👥 **Referral System** - Ajak teman, dapat poin
- 📱 **QR Check-in** - Fast check-in dengan scan QR code
- 🤖 **Wanda AI Chatbot** - Virtual assistant 24/7 (Indonesian NLP)
- 🔔 **Smart Reminders** - Notifikasi service berdasarkan waktu & kilometer
- 🏍️ **Vehicle Management** - Kelola multiple kendaraan
- 📜 **Service History** - Riwayat lengkap semua service
- 💰 **Transparent Pricing** - Breakdown detail biaya service & sparepart

### For Admin (Workshop Owner)
- 📊 **Complete Dashboard** - Overview bisnis real-time
- 📅 **Booking Management** - Calendar view, manual booking, queue management
- 👥 **Customer CRM** - Customer database dengan segmentasi (New, Active, Dormant, VIP)
- 📦 **Inventory Management** - Kelola stok sparepart dengan low stock alerts
- 👨‍🔧 **Technician Management** - Assign & track performance teknisi
- 🎁 **Loyalty Management** - Atur rules loyalty program & rewards
- 🤖 **Chatbot Management** - Train AI, edit responses, handle handover
- 💰 **Financial Reports** - Revenue, booking, customer analytics
- 📧 **Bulk Notifications** - Send promo/reminder ke customer segments
- 📊 **Business Intelligence** - Charts, trends, KPI monitoring

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner Toast

### Backend
- **Database**: Supabase (PostgreSQL)
- **API**: Supabase Edge Functions (Hono server)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

### Future Integrations
- **AI Chatbot**: Dialogflow / Rasa / OpenAI
- **Notifications**: SendGrid (Email) + Twilio (SMS) + Firebase (Push)
- **Payment**: Midtrans / Xendit
- **Analytics**: Google Analytics + Custom events

---

## 📦 Prerequisites

Sebelum memulai, pastikan Anda sudah install:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** atau **yarn** atau **pnpm**
- **Git** ([Download](https://git-scm.com/))
- **Supabase Account** ([Sign up](https://supabase.com/))

Cek versi:
```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
git --version
```

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/sunest-auto.git
cd sunest-auto
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

---

## ⚙️ Configuration

### 1. Setup Environment Variables

Copy `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

### 2. Get Supabase Credentials

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project **sunest-auto-new** (ID: `tvugghippwvoxsjqyxkr`)
3. Go to **Settings** → **API**
4. Copy credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tvugghippwvoxsjqyxkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. Paste ke `.env.local`

### 3. Update `.env.local`

Edit file `.env.local`:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://tvugghippwvoxsjqyxkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here

# Project Configuration (REQUIRED)
NEXT_PUBLIC_PROJECT_ID=tvugghippwvoxsjqyxkr
NEXT_PUBLIC_PROJECT_NAME=sunest-auto-new

# App Configuration (REQUIRED)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://tvugghippwvoxsjqyxkr.supabase.co/functions/v1/make-server-c1ef5280

# Feature Flags (OPTIONAL)
NEXT_PUBLIC_ENABLE_LOYALTY=true
NEXT_PUBLIC_ENABLE_CHATBOT=true
NEXT_PUBLIC_ENABLE_QR_CHECKIN=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# Development
NODE_ENV=development
```

---

## 🏃 Running Locally

### 1. Start Development Server

```bash
npm run dev
```

App akan berjalan di: **http://localhost:3000**

### 2. Access the App

- **Customer Portal**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

### Default Test Accounts

**Customer Account:**
```
Email: customer@test.com
Password: customer123
```

**Admin Account:**
```
Email: admin@test.com
Password: admin123
```

> ⚠️ **Note**: Create these accounts manually di Supabase Auth atau via registration flow.

---

## 📁 Project Structure

```
sunest-auto/
├── app/                          # Next.js 14 App Router (if using)
├── pages/                        # Pages (Next.js Pages Router)
│   ├── admin/                    # Admin dashboard pages
│   │   ├── dashboard.tsx         # Main admin dashboard
│   │   ├── bookings/             # Booking management
│   │   ├── customers/            # Customer CRM
│   │   ├── inventory/            # Spare parts inventory
│   │   ├── technicians/          # Technician management
│   │   ├── loyalty/              # Loyalty program management
│   │   ├── chatbot/              # Chatbot management
│   │   └── reports/              # Financial reports
│   │
│   ├── customer/                 # Customer portal pages
│   │   ├── dashboard.tsx         # Customer dashboard
│   │   ├── booking/              # Booking flow
│   │   ├── jobs/                 # Job tracking
│   │   ├── vehicles/             # Vehicle management
│   │   ├── loyalty/              # Loyalty & rewards
│   │   ├── history/              # Service history
│   │   └── profile/              # Profile settings
│   │
│   ├── auth/                     # Authentication pages
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── reset-password.tsx
│   │
│   ├── _app.tsx                  # App wrapper
│   └── index.tsx                 # Landing page
│
├── components/                   # React components
│   ├── ui/                       # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   │
│   ├── figma/                    # Figma imported components
│   │   └── ImageWithFallback.tsx
│   │
│   ├── admin/                    # Admin-specific components
│   │   ├── Sidebar.tsx
│   │   ├── StatsCard.tsx
│   │   └── ...
│   │
│   └── customer/                 # Customer-specific components
│       ├── BookingCard.tsx
│       ├── VehicleCard.tsx
│       └── ...
│
├── hooks/                        # Custom React hooks
│   ├── useRealtimeJobOrders.ts  # Real-time job updates
│   ├── useDashboardStats.ts     # Dashboard statistics
│   ├── useAuth.ts               # Authentication
│   └── ...
│
├── utils/                        # Utility functions
│   ├── supabase/
│   │   ├── client.ts            # Supabase client
│   │   └── info.tsx             # Project info
│   │
│   ├── api.ts                   # API helpers
│   ├── formatting.ts            # Date, currency formatting
│   └── validation.ts            # Form validation
│
├── supabase/                    # Supabase Edge Functions
│   └── functions/
│       └── server/
│           ├── index.tsx        # Main server (Hono)
│           ├── kv_store.tsx     # KV store utilities (PROTECTED)
│           └── routes/          # API routes
│               ├── bookings.ts
│               ├── customers.ts
│               ├── vehicles.ts
│               ├── parts.ts
│               └── ...
│
├── styles/                      # Global styles
│   └── globals.css              # Tailwind CSS + custom styles
│
├── public/                      # Static assets
│   ├── images/
│   ├── icons/
│   └── ...
│
├── .env.example                 # Environment variables template
├── .env.local                   # Your local env (DO NOT COMMIT)
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── README.md                    # This file
├── SUNEST_AUTO_COMPLETE_PLANNING.md  # Complete planning doc
└── SETUP_GUIDE.md               # Detailed setup guide
```

---

## 🗄️ Database Setup

### 1. Supabase Project Structure

Database menggunakan **Key-Value Store** dengan table:
```
kv_store_c1ef5280
```

### 2. Data Organization (by Prefix)

```
user_           - User accounts
customer_       - Customer data
vehicle_        - Vehicle records
booking_        - Booking/Job orders
sparepart_      - Spare parts inventory
technician_     - Technician data
loyalty_counter_ - Free oil counters
loyalty_points_  - Points accounts
points_tx_      - Points transactions
reward_         - Reward catalog
redemption_     - Reward redemptions
chat_           - Chat messages
notification_   - Notifications
analytics_daily_ - Daily analytics
```

### 3. Initialize Database

**Option A: Via Supabase Dashboard**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr)
2. SQL Editor → New Query
3. Run initialization script (see `SETUP_GUIDE.md`)

**Option B: Via API**

First booking/customer will auto-create entries.

### 4. Seed Test Data (Optional)

Run seed script untuk test data:
```bash
npm run seed
```

---

## 📡 API Documentation

### Base URL (Production)
```
https://tvugghippwvoxsjqyxkr.supabase.co/functions/v1/make-server-c1ef5280
```

### Authentication

All requests require header:
```
Authorization: Bearer {SUPABASE_ANON_KEY}
```

### Main Endpoints

#### Bookings
```
GET    /bookings              - List all bookings
GET    /bookings/:id          - Get booking detail
POST   /bookings              - Create booking
PUT    /bookings/:id          - Update booking
DELETE /bookings/:id          - Cancel booking
```

#### Customers
```
GET    /customers             - List customers
GET    /customers/:id         - Get customer detail
POST   /customers             - Create customer
PUT    /customers/:id         - Update customer
```

#### Vehicles
```
GET    /vehicles              - List vehicles
GET    /vehicles/:id          - Get vehicle detail
POST   /vehicles              - Create vehicle
PUT    /vehicles/:id          - Update vehicle
```

#### Spare Parts
```
GET    /parts                 - List spare parts
GET    /parts/:id             - Get part detail
POST   /parts                 - Create part
PUT    /parts/:id             - Update part
GET    /parts/low-stock       - Get low stock items
```

#### KV Store (Generic)
```
GET    /kv/:key               - Get value by key
POST   /kv                    - Set value
DELETE /kv/:key               - Delete key
GET    /kv/prefix/:prefix     - Get all by prefix
```

**Full API documentation**: See `/SUNEST_AUTO_COMPLETE_PLANNING.md` section "API Endpoints"

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import repository
4. Add environment variables (from `.env.local`)
5. Deploy!

```bash
# Or using Vercel CLI
npm install -g vercel
vercel
```

### Deploy Supabase Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref tvugghippwvoxsjqyxkr

# Deploy functions
supabase functions deploy make-server-c1ef5280
```

### Environment Variables for Production

Add these to Vercel/hosting platform:
```
NEXT_PUBLIC_SUPABASE_URL=https://tvugghippwvoxsjqyxkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_PROJECT_ID=tvugghippwvoxsjqyxkr
NEXT_PUBLIC_APP_URL=https://sunest-auto.vercel.app
NEXT_PUBLIC_API_URL=https://tvugghippwvoxsjqyxkr.supabase.co/functions/v1/make-server-c1ef5280
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Failed to fetch" errors

**Problem**: Cannot connect to Supabase
**Solution**:
- Check `.env.local` has correct credentials
- Verify Supabase project is active
- Check internet connection
- Clear browser cache

```bash
# Test connection
curl https://tvugghippwvoxsjqyxkr.supabase.co
```

#### 2. "Unauthorized" errors

**Problem**: Invalid API key
**Solution**:
- Regenerate keys in Supabase Dashboard
- Update `.env.local`
- Restart dev server

#### 3. Build errors

**Problem**: Missing dependencies
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or
npm ci
```

#### 4. Tailwind CSS not working

**Problem**: Styles not loading
**Solution**:
```bash
# Rebuild Tailwind
npm run build:css

# Or restart dev server
npm run dev
```

#### 5. Real-time updates not working

**Problem**: Supabase Realtime not connected
**Solution**:
- Enable Realtime in Supabase Dashboard
- Check API key has Realtime permissions
- Verify network doesn't block WebSocket

### Get Help

- 📖 Read full planning: `SUNEST_AUTO_COMPLETE_PLANNING.md`
- 📧 Email: support@sunest-auto.com
- 💬 Discord: [Join our server](#)
- 🐛 Issues: [GitHub Issues](#)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

---

## 📞 Support

Need help? Contact us:

- 📧 Email: support@sunest-auto.com
- 📱 WhatsApp: +62 812-3456-7890
- 🌐 Website: https://sunest-auto.com
- 💬 Live Chat: Available in app

---

## 🗺️ Roadmap

- [x] MVP - Core booking & tracking
- [x] Admin dashboard & CRM
- [ ] QR check-in system
- [ ] Loyalty program
- [ ] Wanda AI Chatbot
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration
- [ ] Advanced AI features

See full roadmap in `SUNEST_AUTO_COMPLETE_PLANNING.md`

---

**Made with ❤️ for Indonesian motorcycle workshops** 🏍️

**Version**: 2.0.0  
**Last Updated**: February 7, 2026
