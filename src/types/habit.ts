export type Category = 'all' | 'health' | 'mindset' | 'code' | 'fitness' | 'productivity';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: Exclude<Category, 'all'>;
  color: string;
  icon: string;
  createdAt: string; // ISO string YYYY-MM-DD
  targetPerWeek: number; // e.g. 7 for daily
}

export type HabitLogs = Record<string, string[]>; // habitId -> Array of completed date strings ('YYYY-MM-DD')

export interface HabitStats {
  totalHabits: number;
  completedTodayCount: number;
  completionRatePercentage: number;
  longestStreak: number;
  activeStreaksCount: number;
}
