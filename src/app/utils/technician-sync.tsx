import { projectId, publicAnonKey } from './supabase/info';

export interface Technician {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  status: 'active' | 'inactive';
  notes?: string;
  activeJobs: number;
  completedJobs: number;
  rating: number;
  updatedAt?: string;
}

/**
 * Fetch all technicians from KV Store
 * Data is permanent and synchronized across all components
 */
export async function fetchTechnicians(): Promise<Technician[]> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/prefix/technician_`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch technicians:', response.statusText);
      return [];
    }

    const result = await response.json();
    console.log('👷 Technicians loaded:', result.data?.length || 0, 'items');
    return result.data || [];
  } catch (error) {
    console.error('Error fetching technicians:', error);
    return [];
  }
}

/**
 * Get technician by ID
 */
export async function getTechnicianById(id: string): Promise<Technician | null> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/get/technician_${id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error(`Error fetching technician ${id}:`, error);
    return null;
  }
}

/**
 * Update technician rating
 */
export async function updateTechnicianRating(
  techId: string,
  newRating: number
): Promise<boolean> {
  try {
    // Get current technician data
    const tech = await getTechnicianById(techId);
    if (!tech) {
      console.error(`Technician ${techId} not found`);
      return false;
    }

    // Calculate new average rating
    // Formula: ((current_rating * completed_jobs) + new_rating) / (completed_jobs + 1)
    const totalRating = tech.rating * tech.completedJobs + newRating;
    const newCompletedJobs = tech.completedJobs + 1;
    const updatedRating = totalRating / newCompletedJobs;

    // Update technician
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280/kv/set/technician_${techId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...tech,
          rating: Math.round(updatedRating * 10) / 10, // Round to 1 decimal
          completedJobs: newCompletedJobs,
          updatedAt: new Date().toISOString()
        })
      }
    );

    if (!response.ok) {
      console.error(`Failed to update technician ${techId}:`, response.statusText);
      return false;
    }

    console.log(`✅ Updated technician ${techId} rating to ${updatedRating}`);
    return true;
  } catch (error) {
    console.error(`Error updating technician ${techId}:`, error);
    return false;
  }
}

/**
 * Get active technicians (status: 'active')
 */
export async function getActiveTechnicians(): Promise<Technician[]> {
  const allTechs = await fetchTechnicians();
  return allTechs.filter(tech => tech.status === 'active');
}
