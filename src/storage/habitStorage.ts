import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitLogs } from '@/types/habit';

const HABITS_STORAGE_KEY = '@habit_pulse_habits_v1';
const LOGS_STORAGE_KEY = '@habit_pulse_logs_v1';

// Default initial starter habits so the user immediately sees a populated list
export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    title: 'Daily Code Practice',
    description: 'Solve 1 React Native problem or build a UI component',
    category: 'code',
    color: '#3B82F6',
    icon: 'code-slash',
    createdAt: new Date().toISOString().split('T')[0],
    targetPerWeek: 7,
  },
  {
    id: 'habit-2',
    title: '30 Min Morning Workout',
    description: 'Cardio, stretching, or strength training',
    category: 'fitness',
    color: '#F43F5E',
    icon: 'fitness',
    createdAt: new Date().toISOString().split('T')[0],
    targetPerWeek: 5,
  },
  {
    id: 'habit-3',
    title: '10 Min Meditation & Journal',
    description: 'Mindful breathing and gratitude notes',
    category: 'mindset',
    color: '#8B5CF6',
    icon: 'leaf',
    createdAt: new Date().toISOString().split('T')[0],
    targetPerWeek: 7,
  },
  {
    id: 'habit-4',
    title: 'Hydrate 2.5L Water',
    description: 'Track daily hydration levels',
    category: 'health',
    color: '#10B981',
    icon: 'heart',
    createdAt: new Date().toISOString().split('T')[0],
    targetPerWeek: 7,
  },
];

// Helper for safe web + native storage access
const safeGetItem = async (key: string): Promise<string | null> => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.warn('Storage read fallback:', error);
    return null;
  }
};

const safeSetItem = async (key: string, value: string): Promise<void> => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.warn('Storage write fallback:', error);
  }
};

export const loadStoredHabits = async (): Promise<Habit[]> => {
  try {
    const data = await safeGetItem(HABITS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    await safeSetItem(HABITS_STORAGE_KEY, JSON.stringify(INITIAL_HABITS));
    return INITIAL_HABITS;
  } catch (error) {
    return INITIAL_HABITS;
  }
};

export const saveStoredHabits = async (habits: Habit[]): Promise<void> => {
  await safeSetItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
};

export const loadStoredHabitLogs = async (): Promise<HabitLogs> => {
  try {
    const data = await safeGetItem(LOGS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const initialLogs: HabitLogs = {
      'habit-1': [yesterday, today],
      'habit-2': [yesterday],
      'habit-3': [today],
      'habit-4': [yesterday, today],
    };
    await safeSetItem(LOGS_STORAGE_KEY, JSON.stringify(initialLogs));
    return initialLogs;
  } catch (error) {
    return {};
  }
};

export const saveStoredHabitLogs = async (logs: HabitLogs): Promise<void> => {
  await safeSetItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
};
