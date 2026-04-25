import { Context } from 'npm:hono@4';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Initialize Supabase client
function getSupabaseClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
}

// Process QR Code Check-in (combine validate + update status)
export async function processQRCheckIn(c: Context) {
  try {
    const { qrCode } = await c.req.json();

    if (!qrCode) {
      return c.json({ error: 'QR Code is required' }, 400);
    }

    console.log('🎫 Processing QR Code check-in:', qrCode);

    const supabase = getSupabaseClient();

    // Find job by QR code
    const { data: jobs, error: fetchError } = await supabase
      .from('job_orders')
      .select('*')
      .eq('qr_code_token', qrCode);
    
    if (fetchError || !jobs || jobs.length === 0) {
      console.log('❌ QR Code not found in database');
      return c.json({ error: 'QR Code tidak valid atau booking tidak ditemukan' }, 404);
    }

    const jobOrder = jobs[0];

    // Check if already checked in
    if (jobOrder.status !== 'pending') {
      return c.json({ 
        error: `QR Code sudah digunakan. Status saat ini: ${jobOrder.status}`,
        data: jobOrder
      }, 400);
    }

    // Update status to in_progress (customer sudah check-in dan siap dikerjakan)
    const { data: updatedBooking, error: updateError } = await supabase
      .from('job_orders')
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', jobOrder.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating booking status:', updateError);
      return c.json({ error: 'Gagal mengupdate status booking', details: updateError }, 500);
    }

    console.log('✅ Check-in successful! Status updated to in_progress');

    return c.json({ 
      success: true, 
      data: updatedBooking,
      message: 'Check-in berhasil! Service sedang dikerjakan'
    });

  } catch (error: any) {
    console.error('❌ Error processing QR check-in:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
}

// Validate QR Code and get booking details
export async function validateQRCode(c: Context) {
  try {
    const { qrCode } = await c.req.json();

    if (!qrCode) {
      return c.json({ error: 'QR Code is required' }, 400);
    }

    console.log('🔍 Validating QR Code:', qrCode);

    const supabase = getSupabaseClient();

    // Find job by QR code
    const { data: jobs, error: fetchError } = await supabase
      .from('job_orders')
      .select('*')
      .eq('qr_code_token', qrCode);
    
    if (fetchError || !jobs || jobs.length === 0) {
      console.log('❌ QR Code not found in database');
      return c.json({ error: 'QR Code tidak valid atau booking tidak ditemukan' }, 404);
    }

    const jobOrder = jobs[0];

    console.log('✅ QR Code valid for job:', jobOrder.id);

    // Check if QR already used (status is not pending)
    if (jobOrder.status !== 'pending') {
      console.log('⚠️ QR Code already used. Current status:', jobOrder.status);
      return c.json({ 
        error: `QR Code sudah digunakan. Status booking saat ini: ${jobOrder.status}`,
        data: jobOrder 
      }, 400);
    }

    return c.json({ 
      success: true, 
      data: jobOrder,
      message: 'QR Code valid dan siap diproses'
    });

  } catch (error: any) {
    console.error('❌ Error validating QR Code:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
}

// Update booking status
export async function updateBookingStatus(c: Context) {
  try {
    const bookingId = c.req.param('id');
    const { status } = await c.req.json();

    if (!bookingId || !status) {
      return c.json({ error: 'Booking ID and status are required' }, 400);
    }

    console.log(`📝 Updating booking ${bookingId} to status: ${status}`);

    const supabase = getSupabaseClient();

    // Get current booking
    const { data: currentBooking, error: fetchError } = await supabase
      .from('job_orders')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !currentBooking) {
      console.log('❌ Booking not found:', bookingId);
      return c.json({ error: 'Booking tidak ditemukan' }, 404);
    }

    // Valid status transitions
    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return c.json({ error: 'Status tidak valid' }, 400);
    }

    // Prepare update data
    const updateData: any = {
      status: status,
      updated_at: new Date().toISOString()
    };

    // If moving to completed, add completed_date timestamp
    if (status === 'completed') {
      updateData.completed_date = new Date().toISOString();
      // Auto-delete QR code token
      updateData.qr_code_token = null;
      console.log('🔲 Auto-deleting QR code token (booking completed)');
    }

    // Update booking
    const { data: updatedBooking, error: updateError } = await supabase
      .from('job_orders')
      .update(updateData)
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating booking status:', updateError);
      return c.json({ error: 'Gagal mengupdate status booking' }, 500);
    }

    console.log('✅ Booking status updated successfully');

    return c.json({ 
      success: true, 
      data: updatedBooking,
      message: `Status berhasil diubah menjadi ${status}`
    });

  } catch (error: any) {
    console.error('❌ Error updating booking status:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
}

// Get booking by ID
export async function getBookingById(c: Context) {
  try {
    const bookingId = c.req.param('id');

    if (!bookingId) {
      return c.json({ error: 'Booking ID is required' }, 400);
    }

    const supabase = getSupabaseClient();

    const { data: booking, error } = await supabase
      .from('job_orders')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      return c.json({ error: 'Booking tidak ditemukan' }, 404);
    }

    return c.json({ 
      success: true, 
      data: booking 
    });

  } catch (error: any) {
    console.error('❌ Error getting booking:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
}