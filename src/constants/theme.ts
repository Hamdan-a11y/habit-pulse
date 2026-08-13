import { Category } from '@/types/habit';

export const COLORS = {
  background: '#0F172A',     // Dark slate body background
  card: '#1E293B',           // Elevated card background
  cardBorder: '#334155',     // Subtle border line
  primary: '#6366F1',        // Vibrant Indigo
  primaryLight: 'rgba(99, 102, 241, 0.15)',
  success: '#10B981',        // Emerald Green
  successLight: 'rgba(16, 185, 129, 0.15)',
  warning: '#F59E0B',        // Amber Flame
  warningLight: 'rgba(245, 158, 11, 0.15)',
  danger: '#F43F5E',         // Crimson Red
  dangerLight: 'rgba(244, 63, 94, 0.15)',
  
  text: '#F8FAFC',           // Pure bright text
  textMuted: '#94A3B8',      // Secondary text
  textSubtle: '#64748B',     // Subtle captions
  
  chipBg: '#1E293B',
  chipActiveBg: '#6366F1',
};

export interface CategoryConfig {
  id: Category;
  label: string;
  iconName: string;
  color: string;
}

export const CATEGORIES: CategoryConfig[] = [
  { id: 'all', label: 'All Habits', iconName: 'apps', color: '#6366F1' },
  { id: 'health', label: 'Health', iconName: 'heart', color: '#10B981' },
  { id: 'fitness', label: 'Fitness', iconName: 'fitness', color: '#F43F5E' },
  { id: 'code', label: 'Coding', iconName: 'code-slash', color: '#3B82F6' },
  { id: 'mindset', label: 'Mindset', iconName: 'leaf', color: '#8B5CF6' },
  { id: 'productivity', label: 'Productivity', iconName: 'flash', color: '#F59E0B' },
];

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};
