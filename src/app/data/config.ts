// ============================================================
// APP CONFIG — Kang AC Balap
// Toggle USE_MOCK_DATA = false ketika sudah connect Supabase
// ============================================================

export const APP_CONFIG = {
  // 🔄 Toggle ini untuk switch antara mock data dan real Supabase
  USE_MOCK_DATA: true,

  // Supabase credentials (isi nanti saat production)
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',

  // Company
  COMPANY_NAME: 'Kang AC Balap',
  COMPANY_TAGLINE: 'Solusi AC Terpercaya di Sidoarjo',

  // WhatsApp
  WA_NUMBER: '6282138305151',
  WA_DEFAULT_MESSAGE: 'Halo Kang AC Balap! Saya mau tanya tentang jasa AC.',

  // Theme
  THEME: {
    primary: '#16A34A',
    secondary: '#0F172A',
    accent: '#22D3EE',
  },
};
