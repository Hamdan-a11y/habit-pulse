import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '@/context/HabitContext';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { ProgressBar } from '@/components/ProgressBar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { HabitCard } from '@/components/HabitCard';
import { EmptyState } from '@/components/EmptyState';
import { AddHabitModal } from '@/components/AddHabitModal';
import { Habit } from '@/types/habit';

export default function DashboardScreen() {
  const {
    habits,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    isLoading,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    isCompletedOnDate,
    calculateStreak,
    getOverallStats,
    getTodayFormatted,
  } = useHabits();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayDateFormatted = useMemo(() => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  // Filter habits based on category & search query
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      const matchesCategory =
        selectedCategory === 'all' || habit.category === selectedCategory;
      const matchesSearch =
        habit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (habit.description &&
          habit.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [habits, selectedCategory, searchQuery]);

  const stats = getOverallStats();
  const todayStr = getTodayFormatted();

  const renderHabitItem = ({ item }: { item: Habit }) => {
    const isCompleted = isCompletedOnDate(item.id, todayStr);
    const streak = calculateStreak(item.id);

    return (
      <HabitCard
        habit={item}
        isCompleted={isCompleted}
        streak={streak}
        onToggle={() => toggleHabitCompletion(item.id, todayStr)}
        onDelete={() => deleteHabit(item.id)}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.dateText}>{todayDateFormatted}</Text>
          <Text style={styles.appName}>HabitPulse</Text>
        </View>
        <TouchableOpacity
          style={styles.addHeaderBtn}
          onPress={() => setIsModalOpen(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={COLORS.textSubtle} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search habits..."
          placeholderTextColor={COLORS.textSubtle}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textSubtle} />
          </TouchableOpacity>
        ) : null}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredHabits}
          keyExtractor={(item) => item.id}
          renderItem={renderHabitItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <ProgressBar
                percentage={stats.completionRatePercentage}
                completedCount={stats.completedTodayCount}
                totalCount={stats.totalHabits}
              />
              <CategoryFilter
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </>
          }
          ListEmptyComponent={
            <EmptyState
              title={searchQuery ? 'No Matching Habits' : 'No Habits Found'}
              message={
                searchQuery
                  ? `No habits matching "${searchQuery}". Try a different keyword.`
                  : 'Start building a routine today by adding your first habit!'
              }
              actionText={searchQuery ? undefined : 'Add First Habit'}
              onAction={searchQuery ? undefined : () => setIsModalOpen(true)}
            />
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => setIsModalOpen(true)}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add Habit Modal */}
      <AddHabitModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  dateText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  appName: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 2,
  },
  addHeaderBtn: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 42,
    color: COLORS.text,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 90,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
