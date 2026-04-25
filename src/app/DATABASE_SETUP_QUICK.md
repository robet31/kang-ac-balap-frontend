# ⚡ QUICK DATABASE SETUP - SUNEST AUTO

## 🎯 **5-MINUTE SETUP**

---

## **STEP 1: CREATE SUPABASE PROJECT** (2 min)

```
1. Go to: https://supabase.com
2. Click "New Project"
3. Fill:
   - Name: sunest-auto
   - Password: [strong password - SAVE THIS!]
   - Region: Southeast Asia (Singapore)
4. Click "Create" → Wait 2 minutes
```

---

## **STEP 2: RUN DATABASE SCRIPTS** (2 min)

### **2.1 Migration**
```
1. Supabase Dashboard → SQL Editor → New Query
2. Copy ALL content from: /database/COMPLETE_MIGRATION.sql
3. Paste → Click "Run"
4. ✅ Wait for success message
```

### **2.2 Seed Data**
```
1. SQL Editor → New Query
2. Copy ALL content from: /database/SEED_DATA.sql
3. Paste → Click "Run"
4. ✅ Done!
```

---

## **STEP 3: CREATE USERS** (1 min)

```
Authentication → Users → Add User (3x):

USER 1 - ADMIN:
Email: admin@sunest.auto
Password: admin123
Metadata: {"full_name": "Admin Sunest", "role": "admin"}
✅ Auto Confirm: YES

USER 2 - CUSTOMER:
Email: customer@test.com
Password: customer123
Metadata: {"full_name": "John Doe", "role": "customer"}
✅ Auto Confirm: YES

USER 3 - TECHNICIAN:
Email: technician@sunest.auto
Password: tech123
Metadata: {"full_name": "Budi Teknisi", "role": "technician"}
✅ Auto Confirm: YES
```

---

## **STEP 4: GET CREDENTIALS** (30 sec)

```
Settings → API → Copy these:

1. Project URL: https://[YOUR-ID].supabase.co
2. Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
3. Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## **STEP 5: UPDATE APP CONFIG** (30 sec)

### **5.1 Update info.tsx**
File: `/utils/supabase/info.tsx`

```typescript
export const projectId = "YOUR_PROJECT_ID" // from URL
export const publicAnonKey = "YOUR_ANON_KEY" // from API settings
```

### **5.2 Set Environment Variables**
In Figma Make environment:

```
SUPABASE_URL = https://[YOUR-ID].supabase.co
SUPABASE_SERVICE_ROLE_KEY = [your-service-role-key]
SUPABASE_ANON_KEY = [your-anon-key]
```

---

## **STEP 6: TEST** (1 min)

```
1. Run app
2. Login: customer@test.com / customer123
3. Go to Booking tab
4. Should see 4 service packages
5. ✅ SUCCESS!
```

---

## **🎊 COMPLETE!**

✅ Database created (8 tables)  
✅ 4 service packages  
✅ 25 inventory items  
✅ 3 demo users  
✅ Real-time system ready  

**Your Sunest Auto is LIVE! 🚀**

---

## **🔥 DEMO CREDENTIALS**

```
ADMIN:
Email: admin@sunest.auto
Password: admin123

CUSTOMER:
Email: customer@test.com
Password: customer123

TECHNICIAN:
Email: technician@sunest.auto
Password: tech123
```

---

## **📋 VERIFICATION QUERIES**

Run in SQL Editor to verify:

```sql
-- Check tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check users
SELECT full_name, email, role FROM public.profiles;

-- Check services
SELECT name, base_price FROM public.services;

-- Check inventory
SELECT part_name, quantity_in_stock FROM public.inventory LIMIT 10;
```

---

## **⚠️ TROUBLESHOOTING**

### **Can't see data?**
```
1. Re-run COMPLETE_MIGRATION.sql
2. Re-run SEED_DATA.sql
3. Check: SELECT * FROM public.services;
```

### **Login not working?**
```
1. Check users created in Authentication → Users
2. Verify email/password correct
3. Make sure "Auto Confirm" was checked
```

### **Database error?**
```
1. Check credentials in info.tsx
2. Verify SUPABASE_URL and keys
3. Test in SQL Editor first
```

---

**For detailed guide, see:** `/database/SETUP_INSTRUCTIONS.md`
