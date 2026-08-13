import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Category, Habit, HabitLogs, HabitStats } from '@/types/habit';
import {
  loadStoredHabits,
  saveStoredHabits,
  loadStoredHabitLogs,
  saveStoredHabitLogs,
} from '@/storage/habitStorage';

interface HabitContextType {
  habits: Habit[];
  logs: HabitLogs;
  selectedCategory: Category;
  searchQuery: string;
  isLoading: boolean;
  setSelectedCategory: (cat: Category) => void;
  setSearchQuery: (query: string) => void;
  addHabit: (newHabit: Omit<Habit, 'id' | 'createdAt'>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabitCompletion: (habitId: string, dateStr?: string) => Promise<void>;
  isCompletedOnDate: (habitId: string, dateStr?: string) => boolean;
  calculateStreak: (habitId: string) => number;
  getOverallStats: () => HabitStats;
  getTodayFormatted: () => string;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLogs>({});
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getTodayFormatted = useCallback(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Load initial data from AsyncStorage
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      const loadedHabits = await loadStoredHabits();
      const loadedLogs = await loadStoredHabitLogs();
      setHabits(loadedHabits);
      setLogs(loadedLogs);
      setIsLoading(false);
    };
    initData();
  }, []);

  // Save changes to storage whenever habits change
  const handleSetHabits = async (newHabits: Habit[]) => {
    setHabits(newHabits);
    await saveStoredHabits(newHabits);
  };

  // Save changes to storage whenever logs change
  const handleSetLogs = async (newLogs: HabitLogs) => {
    setLogs(newLogs);
    await saveStoredHabitLogs(newLogs);
  };

  // Add a new habit
  const addHabit = async (newHabitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const today = getTodayFormatted();
    const habit: Habit = {
      ...newHabitData,
      id: `habit-${Date.now()}`,
      createdAt: today,
    };
    const updated = [habit, ...habits];
    await handleSetHabits(updated);
  };

  // Delete a habit
  const deleteHabit = async (id: string) => {
    const updatedHabits = habits.filter((h) => h.id !== id);
    const updatedLogs = { ...logs };
    delete updatedLogs[id];
    await handleSetHabits(updatedHabits);
    await handleSetLogs(updatedLogs);
  };

  // Toggle habit completion for a specific date (defaults to today)
  const toggleHabitCompletion = async (habitId: string, targetDate?: string) => {
    const dateStr = targetDate || getTodayFormatted();
    const currentCompletedDates = logs[habitId] || [];

    let newDates: string[];
    if (currentCompletedDates.includes(dateStr)) {
      // Remove completion
      newDates = currentCompletedDates.filter((d) => d !== dateStr);
    } else {
      // Add completion
      newDates = [...currentCompletedDates, dateStr];
    }

    const updatedLogs = {
      ...logs,
      [habitId]: newDates,
    };
    await handleSetLogs(updatedLogs);
  };

  // Check if habit is completed on a date
  const isCompletedOnDate = (habitId: string, targetDate?: string) => {
    const dateStr = targetDate || getTodayFormatted();
    return (logs[habitId] || []).includes(dateStr);
  };

  // Calculate current streak count for a habit
  const calculateStreak = (habitId: string): number => {
    const completedDates = logs[habitId] || [];
    if (completedDates.length === 0) return 0;

    const todayStr = getTodayFormatted();
    const sortedDates = [...completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    let checkDate = new Date();

    // Check if completed today
    const completedToday = sortedDates.includes(todayStr);
    if (!completedToday) {
      // If not completed today, start checking from yesterday
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = checkDate.toISOString().split('T')[0];
      if (!sortedDates.includes(yesterdayStr)) {
        return 0; // Streak broken if neither today nor yesterday completed
      }
    }

    // Loop backwards day by day
    while (true) {
      const dateString = checkDate.toISOString().split('T')[0];
      if (sortedDates.includes(dateString)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  // Compute aggregate stats across all habits
  const getOverallStats = (): HabitStats => {
    const todayStr = getTodayFormatted();
    const totalHabits = habits.length;
    if (totalHabits === 0) {
      return {
        totalHabits: 0,
        completedTodayCount: 0,
        completionRatePercentage: 0,
        longestStreak: 0,
        activeStreaksCount: 0,
      };
    }

    let completedTodayCount = 0;
    let activeStreaksCount = 0;
    let longestStreak = 0;

    habits.forEach((habit) => {
      if (isCompletedOnDate(habit.id, todayStr)) {
        completedTodayCount++;
      }
      const streak = calculateStreak(habit.id);
      if (streak > 0) {
        activeStreaksCount++;
      }
      if (streak > longestStreak) {
        longestStreak = streak;
      }
    });

    const completionRatePercentage = Math.round((completedTodayCount / totalHabits) * 100);

    return {
      totalHabits,
      completedTodayCount,
      completionRatePercentage,
      longestStreak,
      activeStreaksCount,
    };
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        logs,
        selectedCategory,
        searchQuery,
        isLoading,
        setSelectedCategory,
        setSearchQuery,
        addHabit,
        deleteHabit,
        toggleHabitCompletion,
        isCompletedOnDate,
        calculateStreak,
        getOverallStats,
        getTodayFormatted,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
