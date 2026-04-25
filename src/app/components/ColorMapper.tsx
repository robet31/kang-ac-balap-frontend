/**
 * Color Mapping Guide - MotoCare Pro New Theme
 * 
 * OLD COLORS → NEW COLORS
 * 
 * Primary (Navy Blue):
 * #2A5C82 → #ff7e5f (Coral Orange)
 * #1e4460 → #ff6b47 (Darker Coral)
 * 
 * Secondary (Green):
 * #10B981 → #feb47b (Light Orange/Peach) OR keep for success states
 * 
 * Accent (Amber):
 * #F59E0B → #feb47b (Light Orange/Peach)
 * 
 * Background:
 * #F9FAFB → #fff9f5 (Warm Cream)
 * 
 * Foreground:
 * #111827 → #3d3436 (Warm Dark)
 * 
 * Muted:
 * #F3F4F6 → #fff0eb (Warm Muted)
 * 
 * Border:
 * #E5E7EB → #ffe0d6 (Warm Border)
 * 
 * Use Tailwind classes: bg-primary, text-primary, border-primary, etc.
 */

export const COLOR_MAP = {
  // Old colors (for reference only)
  OLD_PRIMARY: '#2A5C82',
  OLD_PRIMARY_DARK: '#1e4460',
  OLD_SECONDARY: '#10B981',
  OLD_ACCENT: '#F59E0B',
  
  // New colors
  PRIMARY: '#ff7e5f',
  PRIMARY_DARK: '#ff6b47',
  SECONDARY: '#ffedea',
  SECONDARY_FOREGROUND: '#b35340',
  ACCENT: '#feb47b',
  MUTED: '#fff0eb',
  BACKGROUND: '#fff9f5',
  FOREGROUND: '#3d3436',
  BORDER: '#ffe0d6',
  DESTRUCTIVE: '#e63946',
  
  // Success states (keep green for positive actions)
  SUCCESS: '#10B981',
  SUCCESS_DARK: '#059669',
};

export default COLOR_MAP;
