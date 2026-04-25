# ⚡ SUNEST AUTO - Quick Start Guide

Get up and running in **5 minutes**! 🚀

---

## 📋 Prerequisites

✅ Node.js >= 18.0.0  
✅ npm >= 9.0.0  
✅ Supabase account  

---

## 🚀 Quick Setup

### 1. Clone & Install (2 min)

```bash
# Clone repository
git clone https://github.com/yourusername/sunest-auto.git
cd sunest-auto

# Install dependencies
npm install
```

### 2. Configure Environment (2 min)

```bash
# Copy environment file
cp .env.example .env.local
```

**Edit `.env.local`** and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tvugghippwvoxsjqyxkr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Get credentials:**
1. Go to https://supabase.com/dashboard/project/tvugghippwvoxsjqyxkr
2. Settings → API
3. Copy **Project URL** and **API Keys**

### 3. Run App (1 min)

```bash
# Start development server
npm run dev
```

Open: **http://localhost:3000** 🎉

---

## ✅ That's It!

Your app is now running!

### Next Steps:

1. **Create test account**: http://localhost:3000/auth/register
2. **Explore features**: See `README.md`
3. **Seed sample data**: `npm run seed`

### Need Help?

- 📖 Full setup: `SETUP_GUIDE.md`
- 📖 Complete docs: `README.md`
- 📧 Support: support@sunest-auto.com

---

**Happy coding! 🏍️✨**
