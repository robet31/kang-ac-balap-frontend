import { useEffect, useState } from 'react';
import { publicAnonKey, projectId } from '../../utils/supabase/info';
import { toast } from 'sonner';

export function DeleteBookings() {
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (deleted) return;

    const jobsToDelete = ['TRACK-007', 'DEMO-005', 'TRACK-005', 'DEMO-006', 'TRACK-003', 'TRACK-009'];
    
    const deleteAll = async () => {
      console.log('🗑️ Starting bulk delete...');
      
      for (const jobNumber of jobsToDelete) {
        try {
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
            if (data.skipped) {
              console.log(`⚠️ ${jobNumber}: ${data.message}`);
              toast.info(`⚠️ ${jobNumber} - Already deleted`);
            } else {
              console.log(`✅ ${jobNumber} deleted`);
              toast.success(`✅ ${jobNumber} deleted`);
            }
          } else {
            console.log(`❌ ${jobNumber}: ${data.error || 'Failed'}`);
            toast.error(`❌ ${jobNumber}: ${data.error || 'Failed'}`);
          }
        } catch (error) {
          console.error(`💥 Error deleting ${jobNumber}:`, error);
          toast.error(`💥 ${jobNumber}: Network error`);
        }
      }
      
      console.log('✅ Bulk delete complete');
      toast.success('🎉 Bulk delete complete!');
      setDeleted(true);
    };

    deleteAll();
  }, [deleted]);

  return null;
}