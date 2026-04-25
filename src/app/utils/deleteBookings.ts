// Utility to delete multiple bookings
// Usage: Call this from browser console or create a button

import { publicAnonKey, projectId } from './supabase/info';

export async function deleteBookings(jobNumbers: string[]) {
  const results = [];
  
  for (const jobNumber of jobNumbers) {
    try {
      console.log(`🗑️ Deleting ${jobNumber}...`);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/bookings/${jobNumber}`,
        {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${jobNumber} deleted successfully`);
        results.push({ jobNumber, success: true, data });
      } else {
        console.error(`❌ Failed to delete ${jobNumber}:`, data.error);
        results.push({ jobNumber, success: false, error: data.error });
      }
    } catch (error) {
      console.error(`💥 Exception deleting ${jobNumber}:`, error);
      results.push({ jobNumber, success: false, error: String(error) });
    }
  }
  
  return results;
}

// Run this in browser console:
// import { deleteBookings } from './utils/deleteBookings';
// deleteBookings(['TRACK-007', 'DEMO-005', 'TRACK-005', 'DEMO-006', 'TRACK-003', 'TRACK-009']);
