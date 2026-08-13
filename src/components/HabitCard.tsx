import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { Habit } from '@/types/habit';
import { StreakBadge } from './StreakBadge';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  streak: number;
  onToggle: () => void;
  onDelete: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompleted,
  streak,
  onToggle,
  onDelete,
}) => {
  const handleConfirmDelete = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.card, isCompleted && styles.completedCard]}>
      {/* Category indicator bar */}
      <View style={[styles.categoryIndicator, { backgroundColor: habit.color }]} />

      <View style={styles.content}>
        {/* Top line: Icon, Title & Delete button */}
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <View style={[styles.iconContainer, { backgroundColor: `${habit.color}20` }]}>
              <Ionicons name={(habit.icon || 'star') as any} size={18} color={habit.color} />
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[styles.title, isCompleted && styles.completedText]}
                numberOfLines={1}
              >
                {habit.title}
              </Text>
              {habit.description ? (
                <Text style={styles.description} numberOfLines={1}>
                  {habit.description}
                </Text>
              ) : null}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleConfirmDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.deleteBtn}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.textSubtle} />
          </TouchableOpacity>
        </View>

        {/* Bottom line: Streak & Checkmark toggle */}
        <View style={styles.footerRow}>
          <StreakBadge streak={streak} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onToggle}
            style={[
              styles.checkbox,
              isCompleted ? styles.checkboxChecked : styles.checkboxUnchecked,
            ]}
          >
            <Ionicons
              name={isCompleted ? 'checkmark' : 'add'}
              size={18}
              color={isCompleted ? '#FFFFFF' : COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  completedCard: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  categoryIndicator: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  description: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxUnchecked: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  checkboxChecked: {
    backgroundColor: COLORS.success,
  },
});
