import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useHabits } from '@/context/HabitContext';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { AppIcon } from '@/components/AppIcon';

export default function StatsScreen() {
  const { habits, logs, getOverallStats, isCompletedOnDate, calculateStreak } = useHabits();
  const stats = getOverallStats();

  // Generate past 7 days metadata for weekly overview matrix
  const past7Days = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }); // e.g. Mon
      const dayNum = d.getDate();
      days.push({ dateStr, dayName, dayNum, isToday: i === 0 });
    }
    return days;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Habit Insights</Text>
          <Text style={styles.headerSubtitle}>Track your routine performance & consistency</Text>
        </View>

        {/* 2x2 Metric Grid Cards */}
        <View style={styles.grid}>
          {/* Longest Streak Card */}
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: COLORS.warningLight }]}>
              <AppIcon name="flame" size={22} color={COLORS.warning} />
            </View>
            <Text style={styles.statValue}>{stats.longestStreak} days</Text>
            <Text style={styles.statLabel}>Best Active Streak</Text>
          </View>

          {/* Active Streaks Card */}
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: COLORS.primaryLight }]}>
              <AppIcon name="flash" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.statValue}>{stats.activeStreaksCount}</Text>
            <Text style={styles.statLabel}>Active Routines</Text>
          </View>

          {/* Completion Rate Card */}
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: COLORS.successLight }]}>
              <AppIcon name="trophy" size={22} color={COLORS.success} />
            </View>
            <Text style={styles.statValue}>{stats.completionRatePercentage}%</Text>
            <Text style={styles.statLabel}>Today's Rate</Text>
          </View>

          {/* Total Habits Card */}
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <AppIcon name="list" size={22} color="#3B82F6" />
            </View>
            <Text style={styles.statValue}>{stats.totalHabits}</Text>
            <Text style={styles.statLabel}>Total Habits</Text>
          </View>
        </View>

        {/* Weekly Activity Matrix */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Weekly Overview</Text>
          <View style={styles.weekGrid}>
            {past7Days.map((day) => {
              // Count completed habits for this day
              const totalForDay = habits.length;
              let completedForDay = 0;
              habits.forEach((h) => {
                if (isCompletedOnDate(h.id, day.dateStr)) {
                  completedForDay++;
                }
              });

              const isAllDone = totalForDay > 0 && completedForDay === totalForDay;
              const isPartial = completedForDay > 0 && completedForDay < totalForDay;

              return (
                <View key={day.dateStr} style={styles.dayCol}>
                  <Text style={[styles.dayName, day.isToday && styles.todayText]}>
                    {day.dayName}
                  </Text>
                  <View
                    style={[
                      styles.dayDot,
                      isAllDone && styles.dotFull,
                      isPartial && styles.dotPartial,
                      completedForDay === 0 && styles.dotEmpty,
                    ]}
                  >
                    <Text style={styles.dayNum}>{day.dayNum}</Text>
                  </View>
                  <Text style={styles.completedCountText}>
                    {completedForDay}/{totalForDay}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Habit Breakdown Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Habit Breakdown</Text>

          {habits.length === 0 ? (
            <Text style={styles.emptyText}>No habit statistics available yet.</Text>
          ) : (
            habits.map((habit) => {
              const streak = calculateStreak(habit.id);
              const completedDatesCount = (logs[habit.id] || []).length;

              return (
                <View key={habit.id} style={styles.breakdownRow}>
                  <View style={styles.breakdownHeader}>
                    <View style={styles.breakdownTitleRow}>
                      <View
                        style={[
                          styles.dotCategory,
                          { backgroundColor: habit.color },
                        ]}
                      />
                      <Text style={styles.breakdownTitle}>{habit.title}</Text>
                    </View>
                    <Text style={styles.breakdownMeta}>
                      🔥 {streak}d streak • {completedDatesCount} total logs
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 40,
  },
  header: {
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    width: '47%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  dayName: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  todayText: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  dayDot: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotFull: {
    backgroundColor: COLORS.success,
  },
  dotPartial: {
    backgroundColor: COLORS.warning,
  },
  dotEmpty: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  dayNum: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  completedCountText: {
    color: COLORS.textSubtle,
    fontSize: 10,
    fontWeight: '500',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  breakdownRow: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dotCategory: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
  },
  breakdownTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  breakdownMeta: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
});
