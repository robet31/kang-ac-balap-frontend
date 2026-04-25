import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c1ef5280`;

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  useAuth?: boolean;
  accessToken?: string;
}

async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', body, useAuth = false, accessToken } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (useAuth && accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error on ${endpoint}:`, data);
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`Network error calling ${endpoint}:`, error);
    throw error;
  }
}

// ========================================
// JOB ORDERS API
// ========================================

export const jobsApi = {
  getAll: () => apiCall('/jobs'),
  
  getById: (id: string) => apiCall(`/jobs/${id}`),
  
  create: (jobData: any) => apiCall('/jobs', {
    method: 'POST',
    body: jobData,
  }),
  
  updateStatus: (id: string, status: string, notes?: string) => apiCall(`/jobs/${id}/status`, {
    method: 'PUT',
    body: { status, notes },
  }),
};

// ========================================
// INVENTORY API
// ========================================

export const inventoryApi = {
  getAll: () => apiCall('/inventory'),
  
  getLowStock: () => apiCall('/inventory/low-stock'),
  
  add: (itemData: any) => apiCall('/inventory', {
    method: 'POST',
    body: itemData,
  }),
  
  updateStock: (id: string, quantity: number, operation: 'add' | 'subtract') => 
    apiCall(`/inventory/${id}/stock`, {
      method: 'PUT',
      body: { quantity, operation },
    }),
};

// ========================================
// VEHICLES API
// ========================================

export const vehiclesApi = {
  getByCustomer: (customerId: string) => apiCall(`/vehicles/customer/${customerId}`),
  
  add: (vehicleData: any) => apiCall('/vehicles', {
    method: 'POST',
    body: vehicleData,
  }),
};

// ========================================
// KPI & STATISTICS API
// ========================================

export const kpiApi = {
  getDashboard: () => apiCall('/kpi/dashboard'),
};

// ========================================
// HEALTH CHECK
// ========================================

export const healthCheck = () => apiCall('/health');
