import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import * as bookings from "./bookings.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client
function getSupabaseClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
}

// Health check endpoint
app.get("/make-server-c1ef5280/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ========================================
// GENERIC KV STORE ENDPOINTS
// ========================================

// Get value by key
app.get("/make-server-c1ef5280/kv/get/:key", async (c) => {
  try {
    const key = c.req.param("key");
    const value = await kv.get(key);
    
    if (!value) {
      return c.json({ success: false, error: "Key not found" }, 404);
    }
    
    return c.json({ success: true, data: value });
  } catch (error) {
    console.log("Error getting KV value:", error);
    return c.json({ success: false, error: "Failed to get value" }, 500);
  }
});

// Set value by key
app.post("/make-server-c1ef5280/kv/set/:key", async (c) => {
  try {
    const key = c.req.param("key");
    const value = await c.req.json();
    
    await kv.set(key, value);
    
    return c.json({ success: true, message: "Value set successfully" });
  } catch (error) {
    console.log("Error setting KV value:", error);
    return c.json({ success: false, error: "Failed to set value" }, 500);
  }
});

// Get values by prefix
app.get("/make-server-c1ef5280/kv/prefix/:prefix", async (c) => {
  try {
    const prefix = c.req.param("prefix");
    const values = await kv.getByPrefix(prefix);
    
    return c.json({ success: true, data: values });
  } catch (error) {
    console.log("Error getting values by prefix:", error);
    return c.json({ success: false, error: "Failed to get values" }, 500);
  }
});

// Delete value by key
app.delete("/make-server-c1ef5280/kv/delete/:key", async (c) => {
  try {
    const key = c.req.param("key");
    await kv.del(key);
    
    return c.json({ success: true, message: "Value deleted successfully" });
  } catch (error) {
    console.log("Error deleting KV value:", error);
    return c.json({ success: false, error: "Failed to delete value" }, 500);
  }
});

// ========================================
// JOB ORDERS ROUTES
// ========================================

// Get all job orders
app.get("/make-server-c1ef5280/jobs", async (c) => {
  try {
    const jobs = await kv.getByPrefix("job:");
    return c.json({ success: true, data: jobs });
  } catch (error) {
    console.log("Error fetching jobs:", error);
    return c.json({ success: false, error: "Failed to fetch jobs" }, 500);
  }
});

// Get single job order
app.get("/make-server-c1ef5280/jobs/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const job = await kv.get(`job:${id}`);
    
    if (!job) {
      return c.json({ success: false, error: "Job not found" }, 404);
    }
    
    return c.json({ success: true, data: job });
  } catch (error) {
    console.log("Error fetching job:", error);
    return c.json({ success: false, error: "Failed to fetch job" }, 500);
  }
});

// Create new job order
app.post("/make-server-c1ef5280/jobs", async (c) => {
  try {
    const body = await c.req.json();
    const jobId = `JO-${Date.now()}`;
    
    const newJob = {
      id: jobId,
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`job:${jobId}`, newJob);
    
    return c.json({ success: true, data: newJob }, 201);
  } catch (error) {
    console.log("Error creating job:", error);
    return c.json({ success: false, error: "Failed to create job" }, 500);
  }
});

// Update job order status
app.put("/make-server-c1ef5280/jobs/:id/status", async (c) => {
  try {
    const id = c.req.param("id");
    const { status, notes } = await c.req.json();
    
    const job = await kv.get(`job:${id}`);
    
    if (!job) {
      return c.json({ success: false, error: "Job not found" }, 404);
    }
    
    const updatedJob = {
      ...job,
      status,
      notes: notes || job.notes,
      updatedAt: new Date().toISOString(),
    };
    
    if (status === 'in_progress' && !job.startedAt) {
      updatedJob.startedAt = new Date().toISOString();
    }
    
    if (status === 'completed') {
      updatedJob.completedAt = new Date().toISOString();
    }
    
    await kv.set(`job:${id}`, updatedJob);
    
    return c.json({ success: true, data: updatedJob });
  } catch (error) {
    console.log("Error updating job status:", error);
    return c.json({ success: false, error: "Failed to update job status" }, 500);
  }
});

// ========================================
// INVENTORY ROUTES
// ========================================

// Get all inventory items
app.get("/make-server-c1ef5280/inventory", async (c) => {
  try {
    const items = await kv.getByPrefix("inventory:");
    return c.json({ success: true, data: items });
  } catch (error) {
    console.log("Error fetching inventory:", error);
    return c.json({ success: false, error: "Failed to fetch inventory" }, 500);
  }
});

// Get low stock items
app.get("/make-server-c1ef5280/inventory/low-stock", async (c) => {
  try {
    const items = await kv.getByPrefix("inventory:");
    const lowStockItems = items.filter((item: any) => 
      item.quantityInStock <= item.minimumStockLevel
    );
    
    return c.json({ success: true, data: lowStockItems });
  } catch (error) {
    console.log("Error fetching low stock items:", error);
    return c.json({ success: false, error: "Failed to fetch low stock items" }, 500);
  }
});

// Add inventory item
app.post("/make-server-c1ef5280/inventory", async (c) => {
  try {
    const body = await c.req.json();
    const itemId = body.sku || `PART-${Date.now()}`;
    
    const newItem = {
      id: itemId,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`inventory:${itemId}`, newItem);
    
    return c.json({ success: true, data: newItem }, 201);
  } catch (error) {
    console.log("Error adding inventory item:", error);
    return c.json({ success: false, error: "Failed to add inventory item" }, 500);
  }
});

// Update inventory stock
app.put("/make-server-c1ef5280/inventory/:id/stock", async (c) => {
  try {
    const id = c.req.param("id");
    const { quantity, operation } = await c.req.json(); // operation: 'add' or 'subtract'
    
    const item = await kv.get(`inventory:${id}`);
    
    if (!item) {
      return c.json({ success: false, error: "Item not found" }, 404);
    }
    
    const newQuantity = operation === 'add' 
      ? item.quantityInStock + quantity
      : item.quantityInStock - quantity;
    
    if (newQuantity < 0) {
      return c.json({ success: false, error: "Insufficient stock" }, 400);
    }
    
    const updatedItem = {
      ...item,
      quantityInStock: newQuantity,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`inventory:${id}`, updatedItem);
    
    return c.json({ success: true, data: updatedItem });
  } catch (error) {
    console.log("Error updating inventory stock:", error);
    return c.json({ success: false, error: "Failed to update stock" }, 500);
  }
});

// ========================================
// STATISTICS & KPI ROUTES
// ========================================

// Get dashboard KPIs
app.get("/make-server-c1ef5280/kpi/dashboard", async (c) => {
  try {
    const jobs = await kv.getByPrefix("job:");
    const today = new Date().toISOString().split('T')[0];
    
    const activeJobs = jobs.filter((job: any) => 
      job.status === 'in_progress' || job.status === 'scheduled'
    );
    
    const completedToday = jobs.filter((job: any) => 
      job.status === 'completed' && job.completedAt?.startsWith(today)
    );
    
    const pendingPayment = jobs.filter((job: any) => 
      job.status === 'awaiting_payment'
    );
    
    const todayRevenue = completedToday.reduce((sum: number, job: any) => 
      sum + (job.totalAmount || 0), 0
    );
    
    const inventory = await kv.getByPrefix("inventory:");
    const lowStockItems = inventory.filter((item: any) => 
      item.quantityInStock <= item.minimumStockLevel
    );
    
    const kpis = {
      todayRevenue,
      todayTarget: 5000000, // This could be stored in KV as well
      activeJobs: activeJobs.length,
      completedToday: completedToday.length,
      pendingPayment: pendingPayment.length,
      lowStockItems: lowStockItems.length,
    };
    
    return c.json({ success: true, data: kpis });
  } catch (error) {
    console.log("Error fetching KPIs:", error);
    return c.json({ success: false, error: "Failed to fetch KPIs" }, 500);
  }
});

// ========================================
// VEHICLES ENDPOINTS
// ========================================

// Get customer vehicles
app.get("/make-server-c1ef5280/vehicles/customer/:customerId", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const customerId = c.req.param("customerId");
    
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('user_id', customerId) // Changed from customer_id to user_id
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching vehicles:', error);
      return c.json({ success: false, error: 'Failed to fetch vehicles' }, 500);
    }
    
    return c.json({ success: true, data: vehicles });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return c.json({ success: false, error: 'Failed to fetch vehicles' }, 500);
  }
});

// Create new vehicle
app.post("/make-server-c1ef5280/vehicles", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const vehicleData = await c.req.json();
    
    console.log('📥 Creating vehicle with payload:', JSON.stringify(vehicleData, null, 2));
    
    // Prepare vehicle data (map customer_id to user_id)
    const insertData = {
      user_id: vehicleData.customer_id || vehicleData.user_id, // Support both field names
      plate_number: vehicleData.plate_number,
      brand: vehicleData.brand,
      model: vehicleData.model,
      year: vehicleData.year,
      engine_capacity: vehicleData.engine_capacity || null,
      color: vehicleData.color || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📤 Prepared vehicle data:', JSON.stringify(insertData, null, 2));
    
    // Insert vehicle
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .insert(insertData)
      .select()
      .single();
    
    if (vehicleError) {
      console.error('❌ Error creating vehicle:', vehicleError);
      return c.json({ success: false, error: 'Failed to create vehicle', details: vehicleError }, 500);
    }
    
    console.log('✅ Vehicle created successfully:', vehicle);
    return c.json({ success: true, data: vehicle });
    
  } catch (error) {
    console.error('💥 Exception creating vehicle:', error);
    return c.json({ success: false, error: 'Failed to create vehicle', details: error }, 500);
  }
});

// Update vehicle
app.put("/make-server-c1ef5280/vehicles/:vehicleId", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const vehicleId = c.req.param("vehicleId");
    const vehicleData = await c.req.json();
    
    console.log('📥 Updating vehicle:', vehicleId, 'with payload:', JSON.stringify(vehicleData, null, 2));
    
    // Prepare update data
    const updateData = {
      plate_number: vehicleData.plate_number,
      brand: vehicleData.brand,
      model: vehicleData.model,
      year: vehicleData.year,
      engine_capacity: vehicleData.engine_capacity || null,
      color: vehicleData.color || null,
      updated_at: new Date().toISOString()
    };
    
    console.log('📤 Prepared update data:', JSON.stringify(updateData, null, 2));
    
    // Update vehicle
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .update(updateData)
      .eq('id', vehicleId)
      .select()
      .single();
    
    if (vehicleError) {
      console.error('❌ Error updating vehicle:', vehicleError);
      return c.json({ success: false, error: 'Failed to update vehicle', details: vehicleError }, 500);
    }
    
    console.log('✅ Vehicle updated successfully:', vehicle);
    return c.json({ success: true, data: vehicle });
    
  } catch (error) {
    console.error('💥 Exception updating vehicle:', error);
    return c.json({ success: false, error: 'Failed to update vehicle', details: error }, 500);
  }
});

// Delete vehicle
app.delete("/make-server-c1ef5280/vehicles/:vehicleId", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const vehicleId = c.req.param("vehicleId");
    
    console.log('📥 Deleting vehicle:', vehicleId);
    
    // ✅ FIX: Cannot cascade delete jobs since vehicle_id column doesn't exist in job_orders
    // Vehicle info is stored in notes field instead of foreign key relationship
    // Jobs will remain in database with vehicle info in notes field
    console.log('ℹ️ Note: Related job records will remain (vehicle info stored in notes field)');
    
    // Delete the vehicle
    const { error: deleteError } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', vehicleId);
    
    if (deleteError) {
      console.error('❌ Error deleting vehicle:', deleteError);
      return c.json({ success: false, error: 'Failed to delete vehicle', details: deleteError }, 500);
    }
    
    console.log('✅ Vehicle deleted successfully');
    return c.json({ 
      success: true, 
      message: 'Vehicle deleted successfully. Related job records remain with vehicle info in notes.',
      deletedJobCount: 0
    });
    
  } catch (error) {
    console.error('💥 Exception deleting vehicle:', error);
    return c.json({ success: false, error: 'Failed to delete vehicle', details: error }, 500);
  }
});

// Get vehicle bookings/service history
app.get("/make-server-c1ef5280/vehicles/:vehicleId/bookings", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const vehicleId = c.req.param("vehicleId");
    
    console.log('📥 Fetching bookings for vehicle:', vehicleId);
    
    // ✅ FIX: Cannot query by vehicle_id since column doesn't exist in job_orders
    // Vehicle info is stored in notes field, so we can't easily filter by vehicle
    // Return empty array for now
    console.log('ℹ️ Note: Cannot filter bookings by vehicle (vehicle_id column doesn\'t exist)');
    console.log('ℹ️ Vehicle info stored in notes field - would require full text search');
    
    return c.json({ success: true, data: [], message: 'Vehicle bookings feature temporarily unavailable (schema limitation)' });
    
  } catch (error) {
    console.error('💥 Exception fetching vehicle bookings:', error);
    return c.json({ success: false, error: 'Failed to fetch vehicle bookings', details: error }, 500);
  }
});

// ========================================
// BOOKINGS/JOBS ENDPOINTS (Real-Time)
// ========================================

// Create new booking (POST)
app.post("/make-server-c1ef5280/bookings", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const bookingData = await c.req.json();
    
    console.log('📥 Creating booking with payload:', JSON.stringify(bookingData, null, 2));
    console.log('📋 user_id:', bookingData.user_id, 'type:', typeof bookingData.user_id);
    console.log('📋 vehicle_id:', bookingData.vehicle_id, 'type:', typeof bookingData.vehicle_id);
    
    // SERVER-SIDE VALIDATION: Reject mock UUIDs
    if (bookingData.vehicle_id && bookingData.vehicle_id.startsWith('00000000')) {
      console.error('🚫 REJECTED: Mock vehicle UUID detected:', bookingData.vehicle_id);
      return c.json({ 
        success: false, 
        error: 'Invalid vehicle ID: Mock data not allowed. Please select a real vehicle or leave blank.' 
      }, 400);
    }
    
    // ADMIN JOB WORKAROUND: Create/get dummy "Admin Walk-in" user
    let finalUserId = bookingData.user_id;
    
    if (!finalUserId) {
      console.log('🔧 No user_id provided, creating/getting admin walk-in user...');
      
      // Use fixed UUID for admin walk-in customer
      const adminWalkinId = '00000000-0000-0000-0000-000000000001';
      
      // Check if admin walk-in user exists
      const { data: existingUser, error: checkError } = await supabase.auth.admin.getUserById(adminWalkinId);
      
      if (checkError || !existingUser) {
        console.log('🆕 Admin walk-in user not found, creating...');
        
        // Create admin walk-in user
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          id: adminWalkinId,
          email: `admin-walkin-${Date.now()}@sunest-auto.internal`,
          email_confirm: true,
          user_metadata: {
            full_name: 'Admin Walk-in Customer',
            role: 'customer',
            is_admin_created: true
          }
        });
        
        if (createError) {
          console.error('❌ Failed to create admin walk-in user:', createError);
          // Continue anyway, will use the UUID directly
        } else {
          console.log('✅ Created admin walk-in user:', newUser?.user?.id);
        }
      } else {
        console.log('✅ Admin walk-in user exists:', adminWalkinId);
      }
      
      finalUserId = adminWalkinId;
    }
    
    // Generate job number
    const jobNumber = `JO-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    // ✅ Generate unique QR Code
    const qrCode = `SUNEST-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    console.log('🔲 Generated QR Code:', qrCode);
    
    // Build comprehensive notes with metadata
    let comprehensiveNotes = '';
    
    // Add customer info
    if (bookingData.customer_name) {
      comprehensiveNotes += `👤 Customer: ${bookingData.customer_name}\n`;
    }
    
    // Add vehicle info - Fetch from KV store if vehicle_id is a KV key
    if (bookingData.vehicle_id) {
      // Check if vehicle_id is a KV store key (contains underscore pattern)
      if (bookingData.vehicle_id.includes('vehicle_')) {
        console.log('🔍 Vehicle ID appears to be KV store key, fetching data...');
        try {
          const vehicleData = await kv.get(bookingData.vehicle_id);
          if (vehicleData) {
            console.log('✅ Vehicle data from KV:', vehicleData);
            const plateNumber = vehicleData.plate_number || vehicleData.plateNumber || '';
            const brand = vehicleData.brand || '';
            const model = vehicleData.model || '';
            if (plateNumber && (brand || model)) {
              comprehensiveNotes += `🏍️ Kendaraan: ${plateNumber} - ${brand} ${model}\n`;
            } else if (plateNumber) {
              comprehensiveNotes += `🏍️ Kendaraan: ${plateNumber}\n`;
            }
          }
        } catch (kvError) {
          console.error('❌ Error fetching vehicle from KV:', kvError);
        }
      }
    }
    
    // Add package info
    if (bookingData.package_name) {
      comprehensiveNotes += `📦 Paket: ${bookingData.package_name}\n`;
    }
    
    // Add scheduled time
    if (bookingData.scheduled_time) {
      comprehensiveNotes += `⏰ Waktu: ${bookingData.scheduled_time}\n`;
    }
    
    // ✅ FIX: Service fee depends on booking source
    // - User booking via customer dashboard = Rp 0 (gratis promo)
    // - Admin booking via admin dashboard = Rp 25,000 (tetap)
    const isAdminBooking = !bookingData.user_id || finalUserId === '00000000-0000-0000-0000-000000000001';
    
    if (isAdminBooking) {
      // Admin booking - charge Rp 25,000
      comprehensiveNotes += `💰 Biaya Jasa: Rp 25.000\n`;
    } else {
      // Customer booking - FREE promo
      comprehensiveNotes += `💰 Biaya Jasa: Rp 0 (Gratis - Promo Booking Online)\n`;
    }
    
    // Append user's custom notes
    if (bookingData.notes) {
      comprehensiveNotes += `\n${bookingData.notes}`;
    }
    
    // ✅ FIX: Validate vehicle_id format - ONLY UUID allowed in database
    // If vehicle_id is KV key format, set to NULL and use notes instead
    const isValidUUID = bookingData.vehicle_id && 
      bookingData.vehicle_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) &&
      !bookingData.vehicle_id.startsWith('00000000');
    
    const finalVehicleId = isValidUUID ? bookingData.vehicle_id : null;
    
    console.log('🔍 Vehicle ID validation:', {
      original: bookingData.vehicle_id,
      isValidUUID: isValidUUID,
      finalVehicleId: finalVehicleId,
      reason: isValidUUID ? 'Valid UUID' : 'KV key or invalid - stored in notes instead'
    });
    
    // ✅ FIX: Extract vehicle info (NOT NULL constraint)
    let finalVehicleInfo = 'N/A';
    
    // Try to extract from notes (look for 🏍️ Kendaraan: line)
    const vehicleMatch = comprehensiveNotes.match(/🏍️ Kendaraan: ([^\n]+)/);
    if (vehicleMatch && vehicleMatch[1]) {
      finalVehicleInfo = vehicleMatch[1].trim();
    } else if (bookingData.vehicle_plate || bookingData.vehicle_brand || bookingData.vehicle_model) {
      // Construct from individual fields if available
      const parts = [];
      if (bookingData.vehicle_plate) parts.push(bookingData.vehicle_plate);
      if (bookingData.vehicle_brand) parts.push(bookingData.vehicle_brand);
      if (bookingData.vehicle_model) parts.push(bookingData.vehicle_model);
      finalVehicleInfo = parts.join(' - ');
    }
    
    console.log('📝 Final vehicle info:', finalVehicleInfo);
    
    // ✅ FIX: Fetch customer name if not provided (NOT NULL constraint)
    let finalCustomerName = bookingData.customer_name || 'Walk-in Customer';
    
    // Try to fetch from user profile if we have a real user ID
    if (!bookingData.customer_name && finalUserId && finalUserId !== '00000000-0000-0000-0000-000000000001') {
      console.log('🔍 Fetching customer name from profile...');
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', finalUserId)
          .single();
        
        if (profile && !profileError) {
          finalCustomerName = profile.full_name || profile.email || finalCustomerName;
          console.log('✅ Fetched customer name:', finalCustomerName);
        }
      } catch (profileFetchError) {
        console.log('⚠️ Could not fetch profile, using default name');
      }
    }
    
    console.log('📝 Final customer name:', finalCustomerName);
    
    // Prepare job data - Store data in proper columns AND comprehensive notes
    const jobData = {
      job_number: jobNumber,
      customer_id: finalUserId,  // ✅ Changed from user_id to customer_id
      customer_name: finalCustomerName,  // ✅ REQUIRED: NOT NULL constraint
      vehicle_info: finalVehicleInfo,  // ✅ REQUIRED: NOT NULL constraint
      // ✅ REMOVED: vehicle_id field (column doesn't exist in schema - stored in notes)
      service_type: bookingData.service_type || 'Custom Service',
      // ✅ REMOVED: scheduled_date field (column doesn't exist in schema - stored in notes)
      notes: comprehensiveNotes, // ✅ Comprehensive notes with metadata (includes vehicle info, scheduled date/time)
      status: 'pending',
      // ✅ REMOVED: progress field (column doesn't exist in schema)
      // ✅ REMOVED: amount field (column doesn't exist in schema)
      qr_code_token: qrCode,  // ✅ QR Code token for check-in
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📤 Prepared job data:', JSON.stringify(jobData, null, 2));
    
    // Insert job
    const { data: job, error: jobError } = await supabase
      .from('job_orders')
      .insert(jobData)
      .select()
      .single();
    
    if (jobError) {
      console.error('❌ Error creating job:', jobError);
      console.error('❌ Error details:', JSON.stringify(jobError, null, 2));
      console.error('❌ Job data that failed:', JSON.stringify(jobData, null, 2));
      return c.json({ 
        success: false, 
        error: 'Failed to create booking', 
        details: jobError,
        message: jobError.message || 'Unknown error',
        hint: jobError.hint || '',
        code: jobError.code || ''
      }, 500);
    }
    
    console.log('✅ Job created successfully. Job ID:', job.id, 'type:', typeof job.id);
    
    // Insert job items if provided
    // NOTE: Skipping job_items insertion as table doesn't exist in current schema
    // Items info is stored in notes field for now
    if (bookingData.items && bookingData.items.length > 0) {
      console.log('ℹ️ Job items provided but skipping insert (table not in schema):', bookingData.items.length, 'items');
      console.log('📝 Items info stored in notes field');
    }
    
    console.log('🎉 Booking created successfully:', job);
    return c.json({ 
      success: true, 
      data: { 
        job_number: jobNumber,
        job_id: job.id,
        job 
      } 
    });
    
  } catch (error) {
    console.error('💥 Exception creating booking:', error);
    return c.json({ success: false, error: 'Failed to create booking', details: error }, 500);
  }
});

// Get customer bookings (for tracking tab)
app.get("/make-server-c1ef5280/bookings/customer/:customerId", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const customerId = c.req.param("customerId");
    
    console.log(`📥 [Supabase] Fetching customer bookings for: ${customerId}`);
    
    // ✅ RETRY LOGIC: Attempt up to 3 times with exponential backoff
    let attempt = 0;
    const maxAttempts = 3;
    let lastError: any = null;
    
    while (attempt < maxAttempts) {
      try {
        attempt++;
        console.log(`🔄 [Supabase] Attempt ${attempt}/${maxAttempts} to fetch bookings`);
        
        // Fetch jobs without automatic join (no FK relationship exists)
        const { data: jobs, error } = await supabase
          .from('job_orders')
          .select('*')
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        console.log(`✅ [Supabase] Successfully fetched ${jobs?.length || 0} bookings`);
        
        // ✅ REMOVED: Manual vehicle fetch (vehicle_id column doesn't exist)
        // Vehicle info is stored in notes field instead
        return c.json({ success: true, data: jobs || [] });
        
      } catch (retryError: any) {
        lastError = retryError;
        console.error(`❌ [Supabase] Attempt ${attempt} failed:`, {
          message: retryError.message,
          details: retryError.toString(),
          hint: retryError.hint || '',
          code: retryError.code || ''
        });
        
        // If not last attempt, wait before retry (exponential backoff)
        if (attempt < maxAttempts) {
          const waitTime = Math.pow(2, attempt) * 500; // 1s, 2s
          console.log(`⏳ [Supabase] Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    
    // All attempts failed
    console.error('❌ [Supabase] All retry attempts exhausted');
    return c.json({ 
      success: false, 
      error: 'Failed to fetch bookings after multiple attempts', 
      details: lastError 
    }, 500);
    
  } catch (error: any) {
    console.error('❌ [Supabase] Error fetching customer bookings:', {
      message: error.message,
      details: error.toString(),
      hint: error.hint || '',
      code: error.code || ''
    });
    return c.json({ success: false, error: 'Failed to fetch bookings' }, 500);
  }
});

// Get all bookings (admin only)
app.get("/make-server-c1ef5280/bookings", async (c) => {
  try {
    const supabase = getSupabaseClient();
    
    // Fetch jobs without automatic join (no FK relationship exists)
    const { data: jobs, error } = await supabase
      .from('job_orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all bookings:', error);
      return c.json({ success: false, error: 'Failed to fetch bookings', details: error }, 500);
    }
    
    // ✅ REMOVED: Manual vehicle fetch (vehicle_id column doesn't exist)
    // Vehicle info is stored in notes field instead
    return c.json({ success: true, data: jobs || [] });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return c.json({ success: false, error: 'Failed to fetch bookings' }, 500);
  }
});

// Update booking status
app.put("/make-server-c1ef5280/bookings/:id/status", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const id = c.req.param("id");
    const { status, scheduled_date, notes, progress } = await c.req.json();
    
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };
    
    // ✅ REMOVED: scheduled_date field (column doesn't exist in schema)
    // if (scheduled_date) updateData.scheduled_date = scheduled_date;
    if (notes) updateData.notes = notes;
    // ✅ REMOVED: progress field (column doesn't exist in schema)
    // if (progress !== undefined) updateData.progress = progress;
    if (status === 'completed') {
      updateData.completed_date = new Date().toISOString();
      // ✅ AUTO-DELETE: Remove QR code token when booking completed
      updateData.qr_code_token = null;
      console.log('🔲 Auto-deleting QR code token (booking completed)');
    }
    
    // Update without join (no FK relationship)
    const { data: updatedJob, error: updateError } = await supabase
      .from('job_orders')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();
    
    if (updateError) {
      console.error('Error updating booking status:', updateError);
      return c.json({ success: false, error: 'Failed to update status', details: updateError }, 500);
    }
    
    // Manually fetch vehicle data if vehicle_id exists
    let vehicleData = null;
    if (updatedJob.vehicle_id) {
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', updatedJob.vehicle_id)
        .single();
      
      vehicleData = vehicle;
    }
    
    return c.json({ success: true, data: { ...updatedJob, vehicles: vehicleData } });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return c.json({ success: false, error: 'Failed to update status' }, 500);
  }
});

// Delete booking (for testing/cleanup)
app.delete("/make-server-c1ef5280/bookings/:jobNumber", async (c) => {
  try {
    const supabase = getSupabaseClient();
    const jobNumber = c.req.param("jobNumber");
    
    console.log('🗑️ Deleting booking:', jobNumber);
    
    // First check if booking exists
    const { data: existingJob, error: checkError } = await supabase
      .from('job_orders')
      .select('id, job_number')
      .eq('job_number', jobNumber)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking booking:', checkError);
      return c.json({ success: false, error: 'Failed to check booking', details: checkError }, 500);
    }
    
    if (!existingJob) {
      console.log(`⚠️ Booking ${jobNumber} not found, skipping delete`);
      return c.json({ success: true, message: `Booking ${jobNumber} not found (already deleted or never existed)`, skipped: true });
    }
    
    // Delete the booking
    const { data, error } = await supabase
      .from('job_orders')
      .delete()
      .eq('job_number', jobNumber)
      .select()
      .single();
    
    if (error) {
      console.error('Error deleting booking:', error);
      return c.json({ success: false, error: 'Failed to delete booking', details: error }, 500);
    }
    
    console.log('✅ Booking deleted successfully:', jobNumber);
    return c.json({ success: true, data, message: `Booking ${jobNumber} deleted successfully` });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return c.json({ success: false, error: 'Failed to delete booking' }, 500);
  }
});

// ========================================
// QR CODE CHECK-IN ROUTES
// ========================================

// Process QR Code Check-in (combine validate + update status)
app.post("/make-server-c1ef5280/bookings/qr-checkin", async (c) => {
  return await bookings.processQRCheckIn(c);
});

// Validate QR Code only (without updating status)
app.post("/make-server-c1ef5280/bookings/validate-qr", async (c) => {
  return await bookings.validateQRCode(c);
});

// Update booking status by ID
app.put("/make-server-c1ef5280/bookings/:id/update-status", async (c) => {
  return await bookings.updateBookingStatus(c);
});

// Get booking by ID
app.get("/make-server-c1ef5280/bookings/detail/:id", async (c) => {
  return await bookings.getBookingById(c);
});

Deno.serve(app.fetch);